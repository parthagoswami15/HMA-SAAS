import cron from 'node-cron';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

function backoffDelayMs(attempts: number) {
  const base = 1000; // 1s
  const max = 60_000; // 60s
  return Math.min(max, base * Math.pow(2, attempts));
}

export function startNotificationsWorker(prisma: PrismaService) {
  const svc = new NotificationsService(prisma);
  // every minute
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const batch = await prisma.notification.findMany({
      where: {
        status: 'queued',
        OR: [
          { nextAttemptAt: null },
          { nextAttemptAt: { lte: now } },
        ],
      },
      take: 25,
      orderBy: { createdAt: 'asc' },
    });
    for (const n of batch) {
      try {
        await prisma.notification.update({ where: { id: n.id }, data: { status: 'sending' } });
        if (n.channel && n.to) {
          await svc.sendViaProvider({ 
            channel: n.channel, 
            to: n.to, 
            subject: n.subject || undefined, 
            message: n.message 
          });
        }
        await prisma.notification.update({ where: { id: n.id }, data: { status: 'sent', sentAt: new Date(), error: null } });
      } catch (e: any) {
        const attempts = (n.attempts || 0) + 1;
        const delay = backoffDelayMs(attempts);
        const nextAt = new Date(Date.now() + delay);
        await prisma.notification.update({
          where: { id: n.id },
          data: {
            status: attempts >= 5 ? 'failed' : 'queued',
            error: e?.message?.toString() || 'error',
            attempts,
            nextAttemptAt: attempts >= 5 ? null : nextAt,
          },
        });
      }
    }
  });
}



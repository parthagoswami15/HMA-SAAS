"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNotificationsWorker = startNotificationsWorker;
const node_cron_1 = __importDefault(require("node-cron"));
const notifications_service_1 = require("./notifications.service");
function backoffDelayMs(attempts) {
    const base = 1000;
    const max = 60_000;
    return Math.min(max, base * Math.pow(2, attempts));
}
function startNotificationsWorker(prisma) {
    const svc = new notifications_service_1.NotificationsService(prisma);
    node_cron_1.default.schedule('* * * * *', async () => {
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
            }
            catch (e) {
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
//# sourceMappingURL=notifications.worker.js.map
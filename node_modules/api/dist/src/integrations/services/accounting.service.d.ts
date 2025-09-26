import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
export declare class AccountingService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    createJournalEntry(entryDto: any, user: any): Promise<{
        entryId: any;
        entryNumber: any;
        totalDebit: any;
        totalCredit: any;
        status: string;
    }>;
    getAccountLedger(accountCode: string, query: any, user: any): Promise<{
        accountCode: string;
        entries: any;
        openingBalance: number;
        closingBalance: number;
    }>;
    getTrialBalance(query: any, user: any): Promise<{
        asOnDate: any;
        trialBalance: {
            accountCode: string;
            accountName: string;
            debit: any;
            credit: any;
            balance: number;
        }[];
        totalDebit: number;
        totalCredit: number;
    }>;
    getBalanceSheet(query: any, user: any): Promise<{
        asOnDate: any;
        assets: {
            total: number;
            accounts: {
                accountCode: string;
                accountName: string;
                debit: any;
                credit: any;
                balance: number;
            }[];
        };
        liabilities: {
            total: number;
            accounts: {
                accountCode: string;
                accountName: string;
                debit: any;
                credit: any;
                balance: number;
            }[];
        };
        equity: {
            total: number;
            accounts: {
                accountCode: string;
                accountName: string;
                debit: any;
                credit: any;
                balance: number;
            }[];
        };
    }>;
    getProfitLoss(query: any, user: any): Promise<{
        period: {
            fromDate: any;
            toDate: any;
        };
        revenue: {
            total: any;
            accounts: {
                accountCode: any;
                accountName: string;
                amount: any;
            }[];
        };
        expenses: {
            total: any;
            accounts: {
                accountCode: any;
                accountName: string;
                amount: any;
            }[];
        };
        netProfit: number;
    }>;
    getStatus(tenantId: string): Promise<{
        integrationType: string;
        status: string;
        lastSyncAt: any;
        isActive: any;
    }>;
    private getAccountName;
}

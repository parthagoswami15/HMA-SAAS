"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AccountingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let AccountingService = AccountingService_1 = class AccountingService {
    prisma;
    auditService;
    logger = new common_1.Logger(AccountingService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async createJournalEntry(entryDto, user) {
        this.logger.log(`Creating journal entry for tenant: ${user.tenantId}`);
        const { entryDate, description, debitEntries, creditEntries, } = entryDto;
        const totalDebit = debitEntries.reduce((sum, entry) => sum + entry.amount, 0);
        const totalCredit = creditEntries.reduce((sum, entry) => sum + entry.amount, 0);
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new Error('Debits must equal credits');
        }
        const journalEntry = await this.prisma.journalEntry.create({
            data: {
                tenantId: user.tenantId,
                entryDate: new Date(entryDate),
                description,
                totalDebit,
                totalCredit,
                status: 'POSTED',
                postedBy: user.id,
                debitEntries: JSON.stringify(debitEntries),
                creditEntries: JSON.stringify(creditEntries),
            },
        });
        await this.auditService.logActivity({
            action: 'JOURNAL_ENTRY_CREATED',
            entityType: 'JOURNAL_ENTRY',
            entityId: journalEntry.id,
            userId: user.id,
            details: { description, totalDebit },
        });
        return {
            entryId: journalEntry.id,
            entryNumber: journalEntry.entryNumber,
            totalDebit,
            totalCredit,
            status: 'POSTED',
        };
    }
    async getAccountLedger(accountCode, query, user) {
        this.logger.log(`Getting account ledger: ${accountCode}`);
        const { fromDate, toDate, page = 1, limit = 50 } = query;
        const where = {
            tenantId: user.tenantId,
            debitEntries: {
                path: ['$[*].accountCode'],
                array_contains: [accountCode],
            },
        };
        if (fromDate || toDate) {
            where.entryDate = {};
            if (fromDate)
                where.entryDate.gte = new Date(fromDate);
            if (toDate)
                where.entryDate.lte = new Date(toDate);
        }
        const entries = await this.prisma.journalEntry.findMany({
            where,
            orderBy: { entryDate: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        let runningBalance = 0;
        const ledgerEntries = entries.map(entry => {
            const debitEntries = JSON.parse(entry.debitEntries || '[]');
            const creditEntries = JSON.parse(entry.creditEntries || '[]');
            const debit = debitEntries.find((e) => e.accountCode === accountCode)?.amount || 0;
            const credit = creditEntries.find((e) => e.accountCode === accountCode)?.amount || 0;
            runningBalance += debit - credit;
            return {
                entryId: entry.id,
                entryDate: entry.entryDate,
                description: entry.description,
                debit,
                credit,
                balance: runningBalance,
            };
        });
        return {
            accountCode,
            entries: ledgerEntries,
            openingBalance: 0,
            closingBalance: runningBalance,
        };
    }
    async getTrialBalance(query, user) {
        this.logger.log(`Getting trial balance for tenant: ${user.tenantId}`);
        const { asOnDate } = query;
        const entries = await this.prisma.journalEntry.findMany({
            where: {
                tenantId: user.tenantId,
                entryDate: { lte: new Date(asOnDate) },
            },
        });
        const accountBalances = new Map();
        entries.forEach(entry => {
            const debitEntries = JSON.parse(entry.debitEntries || '[]');
            const creditEntries = JSON.parse(entry.creditEntries || '[]');
            debitEntries.forEach((entry) => {
                const balance = accountBalances.get(entry.accountCode) || { debit: 0, credit: 0 };
                balance.debit += entry.amount;
                accountBalances.set(entry.accountCode, balance);
            });
            creditEntries.forEach((entry) => {
                const balance = accountBalances.get(entry.accountCode) || { debit: 0, credit: 0 };
                balance.credit += entry.amount;
                accountBalances.set(entry.accountCode, balance);
            });
        });
        const trialBalance = Array.from(accountBalances.entries()).map(([accountCode, balance]) => ({
            accountCode,
            accountName: this.getAccountName(accountCode),
            debit: balance.debit,
            credit: balance.credit,
            balance: balance.debit - balance.credit,
        }));
        return {
            asOnDate,
            trialBalance,
            totalDebit: trialBalance.reduce((sum, acc) => sum + acc.debit, 0),
            totalCredit: trialBalance.reduce((sum, acc) => sum + acc.credit, 0),
        };
    }
    async getBalanceSheet(query, user) {
        this.logger.log(`Getting balance sheet for tenant: ${user.tenantId}`);
        const { asOnDate } = query;
        const trialBalance = await this.getTrialBalance({ asOnDate }, user);
        const assets = trialBalance.trialBalance.filter(acc => acc.accountCode.startsWith('1'));
        const liabilities = trialBalance.trialBalance.filter(acc => acc.accountCode.startsWith('2'));
        const equity = trialBalance.trialBalance.filter(acc => acc.accountCode.startsWith('3'));
        return {
            asOnDate,
            assets: {
                total: assets.reduce((sum, acc) => sum + acc.balance, 0),
                accounts: assets,
            },
            liabilities: {
                total: liabilities.reduce((sum, acc) => sum + Math.abs(acc.balance), 0),
                accounts: liabilities,
            },
            equity: {
                total: equity.reduce((sum, acc) => sum + Math.abs(acc.balance), 0),
                accounts: equity,
            },
        };
    }
    async getProfitLoss(query, user) {
        this.logger.log(`Getting profit & loss for tenant: ${user.tenantId}`);
        const { fromDate, toDate } = query;
        const entries = await this.prisma.journalEntry.findMany({
            where: {
                tenantId: user.tenantId,
                entryDate: {
                    gte: new Date(fromDate),
                    lte: new Date(toDate),
                },
            },
        });
        const revenueAccounts = new Map();
        const expenseAccounts = new Map();
        entries.forEach(entry => {
            const debitEntries = JSON.parse(entry.debitEntries || '[]');
            const creditEntries = JSON.parse(entry.creditEntries || '[]');
            debitEntries.forEach((entry) => {
                if (entry.accountCode.startsWith('4')) {
                    const balance = expenseAccounts.get(entry.accountCode) || 0;
                    expenseAccounts.set(entry.accountCode, balance + entry.amount);
                }
            });
            creditEntries.forEach((entry) => {
                if (entry.accountCode.startsWith('4')) {
                    const balance = revenueAccounts.get(entry.accountCode) || 0;
                    revenueAccounts.set(entry.accountCode, balance + entry.amount);
                }
            });
        });
        const totalRevenue = Array.from(revenueAccounts.values()).reduce((sum, amount) => sum + amount, 0);
        const totalExpenses = Array.from(expenseAccounts.values()).reduce((sum, amount) => sum + amount, 0);
        const netProfit = totalRevenue - totalExpenses;
        return {
            period: { fromDate, toDate },
            revenue: {
                total: totalRevenue,
                accounts: Array.from(revenueAccounts.entries()).map(([code, amount]) => ({
                    accountCode: code,
                    accountName: this.getAccountName(code),
                    amount,
                })),
            },
            expenses: {
                total: totalExpenses,
                accounts: Array.from(expenseAccounts.entries()).map(([code, amount]) => ({
                    accountCode: code,
                    accountName: this.getAccountName(code),
                    amount,
                })),
            },
            netProfit,
        };
    }
    async getStatus(tenantId) {
        this.logger.log(`Getting accounting status for tenant: ${tenantId}`);
        const config = await this.prisma.integrationConfiguration.findFirst({
            where: {
                tenantId,
                integrationType: 'ACCOUNTING',
            },
        });
        return {
            integrationType: 'ACCOUNTING',
            status: config?.isActive ? 'HEALTHY' : 'ERROR',
            lastSyncAt: config?.lastSyncAt,
            isActive: config?.isActive || false,
        };
    }
    getAccountName(accountCode) {
        const accountNames = {
            '11001': 'Cash',
            '11002': 'Bank',
            '12001': 'Accounts Receivable',
            '21001': 'Accounts Payable',
            '31001': 'Capital',
            '41001': 'Sales Revenue',
            '51001': 'Cost of Goods Sold',
        };
        return accountNames[accountCode] || 'Unknown Account';
    }
};
exports.AccountingService = AccountingService;
exports.AccountingService = AccountingService = AccountingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], AccountingService);
//# sourceMappingURL=accounting.service.js.map
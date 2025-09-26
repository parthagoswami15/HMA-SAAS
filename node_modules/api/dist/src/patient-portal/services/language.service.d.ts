import { PrismaService } from '../../prisma/prisma.service';
export declare class LanguageService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getAvailableLanguages(tenantId: string): Promise<{
        code: string;
        name: string;
        nativeName: string;
        isDefault: boolean;
        isActive: any;
    }[]>;
    setLanguage(languageDto: any, user: any): Promise<{
        language: any;
        message: string;
    }>;
    getCurrentLanguage(user: any): Promise<{
        language: any;
    }>;
    getLocalizedStrings(language: string, keys: string[]): Promise<{}>;
    translateText(text: string, fromLang: string, toLang: string): Promise<any>;
    getTenantLanguages(tenantId: string): Promise<{
        supportedLanguages: any;
        defaultLanguage: any;
    }>;
    updateTenantLanguages(tenantId: string, languagesDto: any, user: any): Promise<{
        supportedLanguages: any;
        defaultLanguage: any;
    }>;
}

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
var LanguageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LanguageService = LanguageService_1 = class LanguageService {
    prisma;
    logger = new common_1.Logger(LanguageService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAvailableLanguages(tenantId) {
        this.logger.log(`Getting available languages for tenant: ${tenantId}`);
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { supportedLanguages: true },
        });
        const supportedLanguages = tenant?.supportedLanguages || ['en', 'hi'];
        const languages = [
            {
                code: 'en',
                name: 'English',
                nativeName: 'English',
                isDefault: true,
                isActive: true,
            },
            {
                code: 'hi',
                name: 'Hindi',
                nativeName: 'हिन्दी',
                isDefault: false,
                isActive: supportedLanguages.includes('hi'),
            },
            {
                code: 'mr',
                name: 'Marathi',
                nativeName: 'मराठी',
                isDefault: false,
                isActive: supportedLanguages.includes('mr'),
            },
            {
                code: 'gu',
                name: 'Gujarati',
                nativeName: 'ગુજરાતી',
                isDefault: false,
                isActive: supportedLanguages.includes('gu'),
            },
            {
                code: 'ta',
                name: 'Tamil',
                nativeName: 'தமிழ்',
                isDefault: false,
                isActive: supportedLanguages.includes('ta'),
            },
            {
                code: 'te',
                name: 'Telugu',
                nativeName: 'తెలుగు',
                isDefault: false,
                isActive: supportedLanguages.includes('te'),
            },
            {
                code: 'kn',
                name: 'Kannada',
                nativeName: 'ಕನ್ನಡ',
                isDefault: false,
                isActive: supportedLanguages.includes('kn'),
            },
            {
                code: 'bn',
                name: 'Bengali',
                nativeName: 'বাংলা',
                isDefault: false,
                isActive: supportedLanguages.includes('bn'),
            },
            {
                code: 'pa',
                name: 'Punjabi',
                nativeName: 'ਪੰਜਾਬੀ',
                isDefault: false,
                isActive: supportedLanguages.includes('pa'),
            },
            {
                code: 'or',
                name: 'Odia',
                nativeName: 'ଓଡ଼ିଆ',
                isDefault: false,
                isActive: supportedLanguages.includes('or'),
            },
        ];
        return languages.filter(lang => lang.isActive);
    }
    async setLanguage(languageDto, user) {
        this.logger.log(`Setting language for user: ${user.id}`);
        const { language } = languageDto;
        const availableLanguages = await this.getAvailableLanguages(user.tenantId);
        const languageExists = availableLanguages.some(lang => lang.code === language);
        if (!languageExists) {
            throw new common_1.BadRequestException('Language not supported');
        }
        const preferences = await this.prisma.patientPreferences.upsert({
            where: { userId: user.id },
            update: {
                language,
                updatedAt: new Date(),
            },
            create: {
                userId: user.id,
                language,
            },
        });
        return {
            language: preferences.language,
            message: 'Language preference updated successfully',
        };
    }
    async getCurrentLanguage(user) {
        this.logger.log(`Getting current language for user: ${user.id}`);
        const preferences = await this.prisma.patientPreferences.findUnique({
            where: { userId: user.id },
        });
        return {
            language: preferences?.language || 'en',
        };
    }
    async getLocalizedStrings(language, keys) {
        this.logger.log(`Getting localized strings for language: ${language}`);
        const translations = {
            en: {
                'welcome': 'Welcome',
                'appointments': 'Appointments',
                'reports': 'Reports',
                'prescriptions': 'Prescriptions',
                'family': 'Family',
                'profile': 'Profile',
                'settings': 'Settings',
                'notifications': 'Notifications',
                'book_appointment': 'Book Appointment',
                'view_reports': 'View Reports',
                'payment_history': 'Payment History',
                'health_timeline': 'Health Timeline',
            },
            hi: {
                'welcome': 'स्वागत है',
                'appointments': 'अपॉइंटमेंट्स',
                'reports': 'रिपोर्ट्स',
                'prescriptions': 'नुस्खे',
                'family': 'परिवार',
                'profile': 'प्रोफ़ाइल',
                'settings': 'सेटिंग्स',
                'notifications': 'सूचनाएं',
                'book_appointment': 'अपॉइंटमेंट बुक करें',
                'view_reports': 'रिपोर्ट देखें',
                'payment_history': 'भुगतान इतिहास',
                'health_timeline': 'स्वास्थ्य समयरेखा',
            },
        };
        const languageStrings = translations[language] || translations['en'];
        return keys.reduce((result, key) => {
            result[key] = languageStrings[key] || key;
            return result;
        }, {});
    }
    async translateText(text, fromLang, toLang) {
        this.logger.log(`Translating text from ${fromLang} to ${toLang}`);
        const mockTranslations = {
            'en_hi': {
                'Welcome': 'स्वागत है',
                'Appointments': 'अपॉइंटमेंट्स',
                'Reports': 'रिपोर्ट्स',
                'Book Appointment': 'अपॉइंटमेंट बुक करें',
            },
            'hi_en': {
                'स्वागत है': 'Welcome',
                'अपॉइंटमेंट्स': 'Appointments',
                'रिपोर्ट्स': 'Reports',
                'अपॉइंटमेंट बुक करें': 'Book Appointment',
            },
        };
        const translationKey = `${fromLang}_${toLang}`;
        const translations = mockTranslations[translationKey] || {};
        return translations[text] || text;
    }
    async getTenantLanguages(tenantId) {
        this.logger.log(`Getting tenant languages for tenant: ${tenantId}`);
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: {
                supportedLanguages: true,
                defaultLanguage: true,
            },
        });
        return {
            supportedLanguages: tenant?.supportedLanguages || ['en'],
            defaultLanguage: tenant?.defaultLanguage || 'en',
        };
    }
    async updateTenantLanguages(tenantId, languagesDto, user) {
        this.logger.log(`Updating tenant languages for tenant: ${tenantId}`);
        const { supportedLanguages, defaultLanguage } = languagesDto;
        const updatedTenant = await this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                supportedLanguages,
                defaultLanguage,
                updatedAt: new Date(),
            },
        });
        return {
            supportedLanguages: updatedTenant.supportedLanguages,
            defaultLanguage: updatedTenant.defaultLanguage,
        };
    }
};
exports.LanguageService = LanguageService;
exports.LanguageService = LanguageService = LanguageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LanguageService);
//# sourceMappingURL=language.service.js.map
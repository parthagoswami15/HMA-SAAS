import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LanguageService {
  private readonly logger = new Logger(LanguageService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAvailableLanguages(tenantId: string) {
    this.logger.log(`Getting available languages for tenant: ${tenantId}`);

    // Get tenant's supported languages
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

  async setLanguage(languageDto: any, user: any) {
    this.logger.log(`Setting language for user: ${user.id}`);

    const { language } = languageDto;

    const availableLanguages = await this.getAvailableLanguages(user.tenantId);
    const languageExists = availableLanguages.some(lang => lang.code === language);

    if (!languageExists) {
      throw new BadRequestException('Language not supported');
    }

    // Update user preferences
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

  async getCurrentLanguage(user: any) {
    this.logger.log(`Getting current language for user: ${user.id}`);

    const preferences = await this.prisma.patientPreferences.findUnique({
      where: { userId: user.id },
    });

    return {
      language: preferences?.language || 'en',
    };
  }

  async getLocalizedStrings(language: string, keys: string[]) {
    this.logger.log(`Getting localized strings for language: ${language}`);

    // In production, load from translation files
    const translations: any = {
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

  async translateText(text: string, fromLang: string, toLang: string) {
    this.logger.log(`Translating text from ${fromLang} to ${toLang}`);

    // In production, integrate with translation service
    // Mock implementation
    const mockTranslations: any = {
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

  async getTenantLanguages(tenantId: string) {
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

  async updateTenantLanguages(tenantId: string, languagesDto: any, user: any) {
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
}

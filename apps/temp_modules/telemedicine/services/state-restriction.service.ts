import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class StateRestrictionService {
  private readonly logger = new Logger(StateRestrictionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async validatePrescriptionRestrictions(state: string, userId: string) {
    this.logger.log(`Validating prescription restrictions for state: ${state}`);

    // Get state-specific restrictions
    // const stateRestrictions = await this.prisma.statePrescriptionRestriction.findUnique({
    //   where: { state },
    // });
    const stateRestrictions = null; // TODO: Implement state restrictions

    if (!stateRestrictions) {
      // If no specific restrictions, allow prescribing
      return { allowed: true };
    }

    // Check if user has required licenses for this state
    // const userLicenses = await this.prisma.userLicense.findMany({
    const userLicenses = []; // TODO: Implement user licenses
    // where: { userId },
    // include: { license: true },
    // });

    const requiredLicenses = stateRestrictions.requiredLicenses || [];
    const userLicenseTypes = []; // TODO: Implement license type mapping

    const missingLicenses = requiredLicenses.filter(
      license => !userLicenseTypes.includes(license)
    );

    if (missingLicenses.length > 0) {
      throw new BadRequestException(
        `Missing required licenses for prescribing in ${state}: ${missingLicenses.join(', ')}`
      );
    }

    // Check drug restrictions
    const restrictedDrugs = stateRestrictions.restrictedDrugs || [];
    if (restrictedDrugs.length > 0) {
      this.logger.warn(`State ${state} has restrictions on: ${restrictedDrugs.join(', ')}`);
    }

    return {
      allowed: true,
      restrictions: {
        restrictedDrugs,
        requiredLicenses,
        specialConditions: stateRestrictions.specialConditions,
      },
    };
  }

  async validateScheduleDrugPrescription(medication: any, userId: string) {
    this.logger.log(`Validating Schedule drug prescription: ${medication.drugName}`);

    // Check if doctor has authority to prescribe Schedule drugs
    const doctor = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        // licenses: {
        //   include: { license: true },
        // },
        state: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Check for Schedule drug license
    // const scheduleLicense = doctor.licenses.find(
    const scheduleLicense = null; // TODO: Implement license checking
    // l => l.license.type === 'SCHEDULE_DRUG_LICENSE'
    // );

    if (!scheduleLicense) {
      throw new BadRequestException(
        `Schedule ${medication.scheduleCategory} drugs require special license`
      );
    }

    // Validate prescription limits based on drug category
    if (medication.scheduleCategory === 'H' || medication.scheduleCategory === 'X') {
      // Narcotics require additional validation
      // const existingPrescriptions = await this.prisma.prescriptionMedication.count({
      const existingPrescriptions = 0; // TODO: Implement prescription counting
      // where: {
      //   prescription: {
      //     doctorId: userId,
      //     createdAt: {
      //       gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      //     },
      //   },
      //   drugName: medication.drugName,
      //   isScheduledDrug: true,
      // },
      // });

      if (existingPrescriptions >= 3) {
        throw new BadRequestException('Monthly limit exceeded for this narcotic drug');
      }
    }

    return { allowed: true };
  }

  async getStateRestrictions(state: string, user: any) {
    // const restrictions = await this.prisma.statePrescriptionRestriction.findUnique({
    //   where: { state },
    // });
    const restrictions = null; // TODO: Implement state restrictions

    if (!restrictions) {
      return {
        state,
        allowed: true,
        restrictions: {
          restrictedDrugs: [],
          requiredLicenses: [],
          specialConditions: null,
        },
      };
    }

    return {
      state,
      allowed: true,
      restrictions: {
        restrictedDrugs: restrictions.restrictedDrugs,
        requiredLicenses: restrictions.requiredLicenses,
        specialConditions: restrictions.specialConditions,
        lastUpdated: restrictions.updatedAt,
      },
    };
  }

  async updateStateRestrictions(state: string, restrictionsDto: any, user: any) {
    this.logger.log(`Updating state restrictions for ${state}`);

    // const updatedRestrictions = await this.prisma.statePrescriptionRestriction.upsert({
    //   where: { state },
    //   update: {
    //     restrictedDrugs: restrictionsDto.restrictedDrugs,
    //     requiredLicenses: restrictionsDto.requiredLicenses,
    //     specialConditions: restrictionsDto.specialConditions,
    //     updatedBy: user.id,
    //     updatedAt: new Date(),
    //   },
    //   create: {
    //     state,
    //     restrictedDrugs: restrictionsDto.restrictedDrugs,
    //     requiredLicenses: restrictionsDto.requiredLicenses,
    //     specialConditions: restrictionsDto.specialConditions,
    //     createdBy: user.id,
    //   },
    // });
    const updatedRestrictions = null; // TODO: Implement state restrictions upsert

    // Log the update
    await this.auditService.logActivity({
      action: 'STATE_RESTRICTIONS_UPDATED',
      entityType: 'STATE_PRESCRIPTION_RESTRICTION',
      entityId: updatedRestrictions.id,
      userId: user.id,
      details: { state, updatedFields: Object.keys(restrictionsDto) },
    });

    return updatedRestrictions;
  }

  async getAllStateRestrictions() {
    // const restrictions = await this.prisma.statePrescriptionRestriction.findMany({
    const restrictions = []; // TODO: Implement state restrictions findMany
    // orderBy: { state: 'asc' },
    // });

    return restrictions;
  }

  async checkDrugAvailability(drugName: string, state: string) {
    this.logger.log(`Checking drug availability: ${drugName} in ${state}`);

    // const stateRestrictions = await this.prisma.statePrescriptionRestriction.findUnique({
    //   where: { state },
    // });
    const stateRestrictions = null; // TODO: Implement state restrictions

    if (!stateRestrictions) {
      return { available: true, restrictions: null };
    }

    const isRestricted = stateRestrictions.restrictedDrugs.includes(drugName);

    return {
      available: !isRestricted,
      restrictions: isRestricted ? 'Drug is restricted in this state' : null,
      state,
    };
  }

  async validateTelemedicinePrescription(state: string, userId: string) {
    this.logger.log(`Validating telemedicine prescription for state: ${state}`);

    // Check if telemedicine prescribing is allowed in this state
    // const telemedicineRules = await this.prisma.telemedicineRegulation.findUnique({
    //   where: { state },
    // });
    const telemedicineRules = null; // TODO: Implement telemedicine regulations

    if (!telemedicineRules) {
      // If no specific rules, assume allowed
      return { allowed: true };
    }

    if (!telemedicineRules.allowed) {
      throw new BadRequestException(`Telemedicine prescribing not allowed in ${state}`);
    }

    // Check if user meets the requirements
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        // licenses: { include: { license: true } },
        experience: true,
        specialization: true,
      },
    });

    const requiredExperience = telemedicineRules.requiredExperience || 0;
    if (user.experience < requiredExperience) {
      throw new BadRequestException(
        `Minimum ${requiredExperience} years experience required for telemedicine in ${state}`
      );
    }

    const requiredSpecializations = telemedicineRules.requiredSpecializations || [];
    if (requiredSpecializations.length > 0 &&
        !requiredSpecializations.includes(user.specialization)) {
      throw new BadRequestException(
        `Required specialization for telemedicine in ${state}: ${requiredSpecializations.join(', ')}`
      );
    }

    return {
      allowed: true,
      rules: {
        requiredExperience,
        requiredSpecializations,
        maxPrescriptionsPerDay: telemedicineRules.maxPrescriptionsPerDay,
        allowedDrugCategories: telemedicineRules.allowedDrugCategories,
      },
    };
  }

  async getPrescriptionLimits(state: string, userId: string) {
    this.logger.log(`Getting prescription limits for state: ${state}`);

    // const stateRestrictions = await this.prisma.statePrescriptionRestriction.findUnique({
    //   where: { state },
    // });
    const stateRestrictions = null; // TODO: Implement state restrictions

    // const telemedicineRules = await this.prisma.telemedicineRegulation.findUnique({
    //   where: { state },
    // });
    const telemedicineRules = null; // TODO: Implement telemedicine regulations

    // Get current usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysPrescriptions = await this.prisma.prescription.count({
      where: {
        doctorId: userId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return {
      state,
      dailyLimit: telemedicineRules?.maxPrescriptionsPerDay || 50,
      todaysCount: todaysPrescriptions,
      remaining: (telemedicineRules?.maxPrescriptionsPerDay || 50) - todaysPrescriptions,
      restrictions: stateRestrictions ? {
        restrictedDrugs: stateRestrictions.restrictedDrugs,
        requiredLicenses: stateRestrictions.requiredLicenses,
      } : null,
    };
  }
}

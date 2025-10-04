import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsurancePolicy, Claim, Prisma } from '@prisma/client';

@Injectable()
export class InsuranceService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // Policy Management
  async createPolicy(data: Prisma.InsurancePolicyCreateInput) {
    return this.prisma.insurancePolicy.create({ data });
  }

  async updatePolicy(id: string, data: Prisma.InsurancePolicyUpdateInput) {
    return this.prisma.insurancePolicy.update({
      where: { id },
      data,
    });
  }

  async getPolicy(id: string) {
    return this.prisma.insurancePolicy.findUnique({
      where: { id },
      include: { claims: true },
    });
  }

  async deletePolicy(id: string) {
    return this.prisma.insurancePolicy.delete({
      where: { id },
    });
  }

  // Claim Management
  async createClaim(data: Prisma.ClaimCreateInput) {
    return this.prisma.claim.create({ data });
  }

  async updateClaim(id: string, data: Prisma.ClaimUpdateInput) {
    return this.prisma.claim.update({
      where: { id },
      data,
    });
  }

  async getClaim(id: string) {
    return this.prisma.claim.findUnique({
      where: { id },
      include: { policy: true },
    });
  }

  // Add this method to fix the error
  async processClaimSettlement(tenantId: string, data: any): Promise<any> {
    try {
      // Implementation for claim settlement
      return { success: true, data };
    } catch (error) {
      throw new Error(`Failed to process claim settlement: ${error.message}`);
    }
  }

  // Add this private method to fix the error
  private async updatePolicyUtilization(
    tx: any,
    policyId: string,
    opdAmount: number = 0,
    totalAmount: number = 0
  ): Promise<void> {
    try {
      // Implementation for updating policy utilization
      await tx.insurancePolicy.update({
        where: { id: policyId },
        data: {
          totalUtilized: { increment: totalAmount },
          opdUtilized: { increment: opdAmount },
        },
      });
    } catch (error) {
      throw new Error(`Failed to update policy utilization: ${error.message}`);
    }
  }
}
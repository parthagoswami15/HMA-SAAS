import { Controller, Post, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TestDataService } from './test-data.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Testing')
@Controller('testing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestDataController {
  constructor(private testDataService: TestDataService) {}

  @Post('seed')
  @Roles(Role.HOSPITAL_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Seed test data for development' })
  @ApiResponse({ status: 201, description: 'Test data seeded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createTestData(@GetUser() user: any) {
    try {
      return await this.testDataService.createTestData(user.tenantId);
    } catch (error) {
      throw error;
    }
  }

  @Delete('clear')
  @Roles(Role.HOSPITAL_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Clear all test data' })
  @ApiResponse({ status: 200, description: 'Test data cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async clearTestData(@GetUser() user: any) {
    try {
      return await this.testDataService.clearTestData(user.tenantId);
    } catch (error) {
      throw error;
    }
  }
}

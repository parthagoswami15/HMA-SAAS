import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { BedWardService } from '../services/bed-ward.service';
import { CreateWardDto } from '../dto/create-ward.dto';
import { UpdateWardDto } from '../dto/update-ward.dto';
import { CreateBedDto } from '../dto/create-bed.dto';
import { UpdateBedDto } from '../dto/update-bed.dto';
import { BedStatus } from '../enums/bed-status.enum';
import { BedClass } from '../enums/bed-class.enum';

@Controller('ipd/wards')
@ApiTags('IPD - Bed & Ward Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class BedWardController {
  constructor(private readonly bedWardService: BedWardService) {}

  // Ward Endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new ward' })
  @ApiResponse({ status: 201, description: 'Ward created successfully' })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  async createWard(@Body() createWardDto: CreateWardDto) {
    return this.bedWardService.createWard(createWardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wards' })
  @ApiResponse({ status: 200, description: 'List of wards' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getWards(@Query('includeBeds') includeBeds: boolean = false) {
    return this.bedWardService.getWards(includeBeds);
  }

  @Get(':wardId')
  @ApiOperation({ summary: 'Get ward by ID' })
  @ApiResponse({ status: 200, description: 'Ward details' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getWardById(
    @Param('wardId', ParseUUIDPipe) wardId: string,
    @Query('includeBeds') includeBeds: boolean = true,
  ) {
    return this.bedWardService.getWardById(wardId, includeBeds);
  }

  @Put(':wardId')
  @ApiOperation({ summary: 'Update ward details' })
  @ApiResponse({ status: 200, description: 'Ward updated successfully' })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  async updateWard(
    @Param('wardId', ParseUUIDPipe) wardId: string,
    @Body() updateWardDto: UpdateWardDto,
  ) {
    return this.bedWardService.updateWard(wardId, updateWardDto);
  }

  @Delete(':wardId')
  @ApiOperation({ summary: 'Delete a ward' })
  @ApiResponse({ status: 200, description: 'Ward deleted successfully' })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  async deleteWard(@Param('wardId', ParseUUIDPipe) wardId: string) {
    return this.bedWardService.deleteWard(wardId);
  }

  // Bed Endpoints
  @Post(':wardId/beds')
  @ApiOperation({ summary: 'Add a new bed to a ward' })
  @ApiResponse({ status: 201, description: 'Bed added successfully' })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.NURSE_IN_CHARGE)
  async addBedToWard(
    @Param('wardId', ParseUUIDPipe) wardId: string,
    @Body() createBedDto: CreateBedDto,
  ) {
    return this.bedWardService.addBedToWard(wardId, createBedDto);
  }

  @Get('beds/available')
  @ApiOperation({ summary: 'Get all available beds' })
  @ApiResponse({ status: 200, description: 'List of available beds' })
  @ApiQuery({ name: 'wardId', required: false, type: String })
  @ApiQuery({ name: 'bedClass', required: false, enum: BedClass })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getAvailableBeds(
    @Query('wardId') wardId?: string,
    @Query('bedClass') bedClass?: BedClass,
  ) {
    return this.bedWardService.getAvailableBeds({ wardId, bedClass });
  }

  @Get('beds/occupied')
  @ApiOperation({ summary: 'Get all occupied beds' })
  @ApiResponse({ status: 200, description: 'List of occupied beds' })
  @ApiQuery({ name: 'wardId', required: false, type: String })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getOccupiedBeds(@Query('wardId') wardId?: string) {
    return this.bedWardService.getOccupiedBeds(wardId);
  }

  @Get('beds/:bedId')
  @ApiOperation({ summary: 'Get bed by ID' })
  @ApiResponse({ status: 200, description: 'Bed details' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getBedById(@Param('bedId', ParseUUIDPipe) bedId: string) {
    return this.bedWardService.getBedById(bedId);
  }

  @Put('beds/:bedId')
  @ApiOperation({ summary: 'Update bed details' })
  @ApiResponse({ status: 200, description: 'Bed updated successfully' })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.NURSE_IN_CHARGE)
  async updateBed(
    @Param('bedId', ParseUUIDPipe) bedId: string,
    @Body() updateBedDto: UpdateBedDto,
  ) {
    return this.bedWardService.updateBed(bedId, updateBedDto);
  }

  @Delete('beds/:bedId')
  @ApiOperation({ summary: 'Remove a bed' })
  @ApiResponse({ status: 200, description: 'Bed removed successfully' })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  async removeBed(@Param('bedId', ParseUUIDPipe) bedId: string) {
    return this.bedWardService.removeBed(bedId);
  }

  @Put('beds/:bedId/status')
  @ApiOperation({ summary: 'Update bed status' })
  @ApiResponse({ status: 200, description: 'Bed status updated' })
  @Roles(UserRole.ADMIN, UserRole.NURSE, UserRole.HOUSEKEEPING)
  async updateBedStatus(
    @Param('bedId', ParseUUIDPipe) bedId: string,
    @Body('status') status: BedStatus,
    @Body('updatedById') updatedById: string,
    @Body('notes') notes?: string,
  ) {
    if (!Object.values(BedStatus).includes(status)) {
      throw new BadRequestException('Invalid bed status');
    }
    return this.bedWardService.updateBedStatus(bedId, status, updatedById, notes);
  }

  @Get('beds/statistics')
  @ApiOperation({ summary: 'Get bed statistics' })
  @ApiResponse({ status: 200, description: 'Bed statistics' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getBedStatistics() {
    return this.bedWardService.getBedStatistics();
  }

  @Get('beds/occupancy')
  @ApiOperation({ summary: 'Get bed occupancy report' })
  @ApiResponse({ status: 200, description: 'Bed occupancy report' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getBedOccupancyReport(
    @Query('wardId') wardId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.bedWardService.getBedOccupancyReport({
      wardId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }
}

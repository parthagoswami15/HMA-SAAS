import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ImagingOrdersService } from '../services/imaging-orders.service';
import {
  CreateImagingOrderDto,
  UpdateImagingOrderDto,
  ScheduleImagingOrderDto,
  ImagingOrderFilterDto,
  ImagingOrderListDto,
} from '../dto/imaging-orders.dto';

@ApiTags('Radiology - Imaging Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('radiology/imaging-orders')
export class ImagingOrdersController {
  constructor(private readonly imagingOrdersService: ImagingOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new imaging order' })
  @ApiResponse({ status: 201, description: 'Imaging order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Patient or modality not found' })
  async create(@Body() createDto: CreateImagingOrderDto, @Request() req) {
    return this.imagingOrdersService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all imaging orders with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Imaging orders retrieved successfully' })
  async findAll(
    @Query() filterDto: ImagingOrderFilterDto,
    @Query() listDto: ImagingOrderListDto,
  ) {
    return this.imagingOrdersService.findAll(filterDto, listDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get imaging order by ID' })
  @ApiResponse({ status: 200, description: 'Imaging order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Imaging order not found' })
  async findOne(@Param('id') id: string) {
    return this.imagingOrdersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update imaging order' })
  @ApiResponse({ status: 200, description: 'Imaging order updated successfully' })
  @ApiResponse({ status: 404, description: 'Imaging order not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateImagingOrderDto) {
    return this.imagingOrdersService.update(id, updateDto);
  }

  @Post(':id/schedule')
  @ApiOperation({ summary: 'Schedule imaging order' })
  @ApiResponse({ status: 200, description: 'Imaging order scheduled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid scheduling request' })
  @ApiResponse({ status: 404, description: 'Imaging order not found' })
  async schedule(@Param('id') id: string, @Body() scheduleDto: ScheduleImagingOrderDto) {
    return this.imagingOrdersService.schedule(id, scheduleDto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark imaging order as completed' })
  @ApiResponse({ status: 200, description: 'Imaging order completed successfully' })
  @ApiResponse({ status: 400, description: 'Order cannot be completed' })
  @ApiResponse({ status: 404, description: 'Imaging order not found' })
  async complete(@Param('id') id: string) {
    return this.imagingOrdersService.complete(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel imaging order' })
  @ApiResponse({ status: 200, description: 'Imaging order cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Order cannot be cancelled' })
  @ApiResponse({ status: 404, description: 'Imaging order not found' })
  async cancel(@Param('id') id: string, @Body('reason') reason: string) {
    return this.imagingOrdersService.cancel(id, reason);
  }

  @Get('patient/:patientId/history')
  @ApiOperation({ summary: 'Get patient imaging history' })
  @ApiResponse({ status: 200, description: 'Patient imaging history retrieved successfully' })
  async getPatientHistory(@Param('patientId') patientId: string) {
    return this.imagingOrdersService.getPatientHistory(patientId);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get imaging orders statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(@Request() req) {
    return this.imagingOrdersService.getStats(req.user.tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete imaging order' })
  @ApiResponse({ status: 204, description: 'Imaging order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Imaging order not found' })
  async remove(@Param('id') id: string) {
    // Implementation would depend on business rules
    // For now, we'll just return success
    throw new Error('Delete functionality not implemented');
  }
}

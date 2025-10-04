import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabOrdersService } from '../services/lab-orders.service';
import { CreateLabOrderDto, UpdateLabOrderDto, LabOrderResponseDto } from '../dto/lab-order.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Orders')
@Controller('lab/orders')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabOrdersController {
  constructor(private readonly labOrdersService: LabOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lab order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async createOrder(@Body() createOrderDto: CreateLabOrderDto): Promise<LabOrderResponseDto> {
    return this.labOrdersService.createOrder(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lab orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getAllOrders(
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ): Promise<LabOrderResponseDto[]> {
    return this.labOrdersService.getAllOrders({
      patientId,
      status,
      priority,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lab order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  async getOrderById(@Param('id') id: string): Promise<LabOrderResponseDto> {
    return this.labOrdersService.getOrderById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lab order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateLabOrderDto,
  ): Promise<LabOrderResponseDto> {
    return this.labOrdersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel lab order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  async cancelOrder(@Param('id') id: string): Promise<{ message: string }> {
    return this.labOrdersService.cancelOrder(id);
  }

  @Post(':id/collect')
  @ApiOperation({ summary: 'Mark order as collected' })
  @ApiResponse({ status: 200, description: 'Order marked as collected' })
  async collectOrder(@Param('id') id: string): Promise<LabOrderResponseDto> {
    return this.labOrdersService.collectOrder(id);
  }

  @Post(':id/accession')
  @ApiOperation({ summary: 'Accession the order' })
  @ApiResponse({ status: 200, description: 'Order accessioned successfully' })
  async accessionOrder(@Param('id') id: string): Promise<LabOrderResponseDto> {
    return this.labOrdersService.accessionOrder(id);
  }

  @Get(':id/barcode')
  @ApiOperation({ summary: 'Generate barcode for order' })
  @ApiResponse({ status: 200, description: 'Barcode generated successfully' })
  async generateBarcode(@Param('id') id: string): Promise<{ barcode: string }> {
    return this.labOrdersService.generateBarcode(id);
  }
}

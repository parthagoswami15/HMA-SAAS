import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PathologyService } from './pathology.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface CreateLabTestDto {
  name: string;
  code: string;
  description?: string;
  category: string;
  price?: number;
}

interface CreateLabOrderDto {
  patientId: string;
  doctorId?: string;
  tests: string[]; // Array of testIds
  notes?: string;
}

@Controller('pathology')
@UseGuards(JwtAuthGuard)
export class PathologyController {
  constructor(private readonly pathologyService: PathologyService) {}

  // Lab Tests
  @Post('tests')
  createTest(@Body() createDto: CreateLabTestDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.createTest(createDto, tenantId);
  }

  @Get('tests')
  findAllTests(@Req() req: any, @Query() query: any) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.findAllTests(tenantId, query);
  }

  @Get('tests/:id')
  findOneTest(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.findOneTest(id, tenantId);
  }

  @Patch('tests/:id')
  updateTest(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateLabTestDto>,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.updateTest(id, updateDto, tenantId);
  }

  @Delete('tests/:id')
  removeTest(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.removeTest(id, tenantId);
  }

  // Lab Orders
  @Post('orders')
  createOrder(@Body() createDto: CreateLabOrderDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.createOrder(createDto, tenantId);
  }

  @Get('orders')
  findAllOrders(@Req() req: any, @Query() query: any) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.findAllOrders(tenantId, query);
  }

  @Get('orders/:id')
  findOneOrder(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.findOneOrder(id, tenantId);
  }

  @Patch('orders/:id')
  updateOrder(
    @Param('id') id: string,
    @Body() updateDto: any,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.updateOrder(id, updateDto, tenantId);
  }

  @Delete('orders/:id')
  removeOrder(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.removeOrder(id, tenantId);
  }

  @Patch('orders/:orderId/tests/:testId/result')
  updateTestResult(
    @Param('orderId') orderId: string,
    @Param('testId') testId: string,
    @Body() resultDto: { result: string; notes?: string },
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.updateTestResult(orderId, testId, resultDto, tenantId);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.pathologyService.getStats(tenantId);
  }
}

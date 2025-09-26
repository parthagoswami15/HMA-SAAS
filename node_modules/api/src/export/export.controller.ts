import { Controller, Get, Post, Query, UseGuards, Request, Res, Body, Param } from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { ExportService } from './export.service';
import type { ExportOptions, BackupOptions } from './export.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { createReadStream } from 'fs';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    userId: string;
    tenantId: string;
    role: Role;
  };
}

@Controller('export')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('patients')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.NURSE)
  async exportPatients(
    @Request() req: AuthenticatedRequest,
    @Query('format') format: 'excel' | 'csv' | 'json' = 'excel',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res: Response,
  ) {
    const options: ExportOptions = {
      format,
      ...(startDate && endDate && {
        dateRange: {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      }),
    };

    const result = await this.exportService.exportPatients(req.user.tenantId, options);
    
    res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
    res.setHeader('Content-Type', this.getContentType(format));
    
    const fileStream = createReadStream(result.filePath);
    fileStream.pipe(res);
  }

  @Get('lab-results')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.LAB_TECHNICIAN)
  async exportLabResults(
    @Request() req: AuthenticatedRequest,
    @Query('format') format: 'excel' | 'csv' | 'json' = 'excel',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res: Response,
  ) {
    const options: ExportOptions = {
      format,
      ...(startDate && endDate && {
        dateRange: {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      }),
    };

    const result = await this.exportService.exportLabResults(req.user.tenantId, options);
    
    res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
    res.setHeader('Content-Type', this.getContentType(format));
    
    const fileStream = createReadStream(result.filePath);
    fileStream.pipe(res);
  }

  @Get('financial')
  @Roles(Role.HOSPITAL_ADMIN, Role.OWNER)
  async exportFinancialData(
    @Request() req: AuthenticatedRequest,
    @Query('format') format: 'excel' | 'json' = 'excel',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res: Response,
  ) {
    const options: ExportOptions = {
      format,
      ...(startDate && endDate && {
        dateRange: {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      }),
    };

    const result = await this.exportService.exportFinancialData(req.user.tenantId, options);
    
    res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
    res.setHeader('Content-Type', this.getContentType(format));
    
    const fileStream = createReadStream(result.filePath);
    fileStream.pipe(res);
  }

  @Post('backup/create')
  @Roles(Role.HOSPITAL_ADMIN, Role.OWNER)
  async createBackup(
    @Request() req: AuthenticatedRequest,
    @Body() options: BackupOptions,
  ) {
    const result = await this.exportService.createFullBackup(req.user.tenantId, options);
    return {
      message: 'Backup created successfully',
      fileName: result.fileName,
      filePath: result.filePath,
    };
  }

  @Get('backup/download/:fileName')
  @Roles(Role.HOSPITAL_ADMIN, Role.OWNER)
  async downloadBackup(
    @Request() req: AuthenticatedRequest,
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = `backups/${fileName}`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Post('backup/restore')
  @Roles(Role.OWNER)
  async restoreBackup(
    @Request() req: AuthenticatedRequest,
    @Body() body: { backupFilePath: string },
  ) {
    await this.exportService.restoreFromBackup(req.user.tenantId, body.backupFilePath);
    return {
      message: 'Backup restored successfully',
    };
  }

  private getContentType(format: string): string {
    switch (format) {
      case 'excel':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'csv':
        return 'text/csv';
      case 'json':
        return 'application/json';
      default:
        return 'application/octet-stream';
    }
  }
}

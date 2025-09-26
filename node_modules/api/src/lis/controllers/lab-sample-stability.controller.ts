import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabSampleStabilityService, SampleIssue } from '../services/lab-sample-stability.service';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Sample Stability')
@Controller('lab/sample-stability')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabSampleStabilityController {
  constructor(private readonly labSampleStabilityService: LabSampleStabilityService) {}

  @Get('check/:sampleId')
  @ApiOperation({ summary: 'Check sample stability' })
  @ApiResponse({ status: 200, description: 'Sample stability checked successfully' })
  async checkSampleStability(@Param('sampleId') sampleId: string): Promise<{
    isStable: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    return this.labSampleStabilityService.checkSampleStability(sampleId);
  }

  @Post('issues')
  @ApiOperation({ summary: 'Report a sample issue' })
  @ApiResponse({ status: 201, description: 'Sample issue reported successfully' })
  async reportSampleIssue(
    @Body() issueData: Omit<SampleIssue, 'id'>,
  ): Promise<SampleIssue> {
    return this.labSampleStabilityService.createSampleIssue(issueData);
  }

  @Post('addon-test/:sampleId')
  @ApiOperation({ summary: 'Check if add-on test can be performed' })
  @ApiResponse({ status: 200, description: 'Add-on test feasibility checked successfully' })
  async checkAddOnTest(
    @Param('sampleId') sampleId: string,
    @Body('testId') testId: string,
  ): Promise<{
    canAdd: boolean;
    reason?: string;
    recommendations?: string[];
  }> {
    return this.labSampleStabilityService.handleAddOnTest(sampleId, testId);
  }

  @Get('expired')
  @ApiOperation({ summary: 'Get expired samples' })
  @ApiResponse({ status: 200, description: 'Expired samples retrieved successfully' })
  async getExpiredSamples(): Promise<any[]> {
    return this.labSampleStabilityService.getExpiredSamples();
  }

  @Get('recollection-required')
  @ApiOperation({ summary: 'Get samples requiring recollection' })
  @ApiResponse({ status: 200, description: 'Samples requiring recollection retrieved successfully' })
  async getSamplesRequiringRecollection(): Promise<any[]> {
    return this.labSampleStabilityService.getSamplesRequiringRecollection();
  }

  @Get('issues/:sampleId')
  @ApiOperation({ summary: 'Get issues for a sample' })
  @ApiResponse({ status: 200, description: 'Sample issues retrieved successfully' })
  async getSampleIssues(@Param('sampleId') sampleId: string): Promise<SampleIssue[]> {
    return this.labSampleStabilityService.getSampleIssues(sampleId);
  }

  @Put('condition/:sampleId')
  @ApiOperation({ summary: 'Update sample condition' })
  @ApiResponse({ status: 200, description: 'Sample condition updated successfully' })
  async updateSampleCondition(
    @Param('sampleId') sampleId: string,
    @Body() condition: {
      hemolysisLevel?: number;
      clottingStatus?: string;
      contaminationStatus?: string;
      volume?: number;
    },
  ): Promise<{ message: string }> {
    await this.labSampleStabilityService.updateSampleCondition(sampleId, condition);
    return { message: 'Sample condition updated successfully' };
  }

  @Get('stability-rules')
  @ApiOperation({ summary: 'Get sample stability rules' })
  @ApiResponse({ status: 200, description: 'Stability rules retrieved successfully' })
  async getStabilityRules(): Promise<any[]> {
    // This would return the stability rules from the service
    return [];
  }

  @Get('quality-metrics')
  @ApiOperation({ summary: 'Get sample quality metrics' })
  @ApiResponse({ status: 200, description: 'Quality metrics retrieved successfully' })
  async getQualityMetrics(@Query('tenantId') tenantId: string): Promise<any> {
    const expiredSamples = await this.labSampleStabilityService.getExpiredSamples();
    const recollectionSamples = await this.labSampleStabilityService.getSamplesRequiringRecollection();

    return {
      expiredSamplesCount: expiredSamples.length,
      recollectionRequiredCount: recollectionSamples.length,
      qualityScore: this.calculateQualityScore(expiredSamples.length, recollectionSamples.length),
      commonIssues: this.analyzeCommonIssues(recollectionSamples),
    };
  }

  private calculateQualityScore(expiredCount: number, recollectionCount: number): number {
    const totalIssues = expiredCount + recollectionCount;
    // Simple quality score calculation
    return Math.max(0, 100 - (totalIssues * 5));
  }

  private analyzeCommonIssues(samples: any[]): any[] {
    const issueCounts: { [key: string]: number } = {};

    samples.forEach(sample => {
      if (sample.issues) {
        sample.issues.forEach((issue: any) => {
          issueCounts[issue.issueType] = (issueCounts[issue.issueType] || 0) + 1;
        });
      }
    });

    return Object.entries(issueCounts)
      .map(([issueType, count]) => ({ issueType, count }))
      .sort((a, b) => b.count - a.count);
  }
}

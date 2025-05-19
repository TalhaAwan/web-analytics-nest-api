import { Body, Controller, Post, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateVisitDto } from './dto/analytics.dto';
import { Request } from 'express';

@Controller('api')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('/visit')
  createVisit(@Body() body: CreateVisitDto, @Req() req: Request) {
    return this.analyticsService.trackPageView(body);
  }
}

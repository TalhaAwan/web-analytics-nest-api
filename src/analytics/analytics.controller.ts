import { Body, Controller, Post, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateVisitDto } from './dto/analytics.dto';
import { Request } from 'express';

@Controller("api")
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService) { }

  @Post('/visit')
  createVisit(@Body() body: CreateVisitDto, @Req() req: Request) {
    const visitData = {
      ...body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: (req.headers.referer || req.headers.referrer) as string,
      origin: req.headers.origin,
    };

    return this.analyticsService.createVisit(visitData);
  }


}

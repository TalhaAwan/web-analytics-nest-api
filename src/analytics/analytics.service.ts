import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import { v4 as uuidv4 } from 'uuid';
import ct from "countries-and-timezones";

interface CreateVisitData {
  appKey: string;
  sessionId: string;
  timezone: string;
  page: string;
  userAgent: string;
  referrer: string;
  ipAddress: string
  origin: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly analyticsRepository: AnalyticsRepository,
  ) { }

  async createVisit(data: CreateVisitData) {
    const country = ct.getCountryForTimezone(data.timezone);

    if (!country?.name) {
      throw new HttpException(`No country found for timezone ${data.timezone}`, HttpStatus.BAD_REQUEST);
    }

    await this.analyticsRepository.createVisit({
      appKey: data.appKey,
      sessionId: data.sessionId,
      visitId: uuidv4(),
      timezone: data.timezone,
      country: country?.name,
      iso2: country?.id,
      referrer: data.referrer,
      ipAddress: data.ipAddress,
      page: data.page,
      userAgent: data.userAgent,
      origin: data.origin,
    });

    return {
      success: true
    };
  }
}

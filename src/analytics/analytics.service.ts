import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import { v4 as uuidv4 } from 'uuid';
import ct from 'countries-and-timezones';
import { CreateVisitDto } from './dto/analytics.dto';

import * as crypto from 'crypto';

/**
 * Generate a session ID based on IP, User-Agent, ISO2 country code, and optional timestamp.
 * @param ip - IP address (can be hashed already or anonymized)
 * @param userAgent - User agent string
 * @param iso2 - Country code (ISO2)
 * @param timestamp - Optional: JS Date or milliseconds since epoch
 * @param windowMs - Time window in milliseconds (default: 30 mins)
 */
export function generateSessionId(
  ip: string,
  userAgent: string,
  iso2: string,
  timestamp: number = Date.now(),
  windowMs: number = 1000 * 60 * 2,
): string {
  const roundedTimestamp = Math.floor(timestamp / windowMs) * windowMs;
  const rawString = `${ip}|${userAgent}|${iso2}|${roundedTimestamp}`;
  const hash = crypto.createHash('sha256').update(rawString).digest('hex');
  return hash;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async trackPageView(data: {
    ip: string;
    user_agent: string;
    iso2?: string;
    timezone?: string;
    referrer?: string;
    app_key: string;
    path: string;
  }) {
    let iso2 = data.iso2;
    if (!data.iso2 && !data.timezone) {
      throw new HttpException(
        `Require one of 'iso2' or 'timezone' fields`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!data.iso2) {
      const country = ct.getCountryForTimezone(data.timezone);
      if (!country?.id) {
        throw new HttpException(
          `No country found for timezone ${data.timezone}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      iso2 = country.id.toLowerCase();
    }

    const session_id = generateSessionId(data.ip, data.user_agent, iso2);

    console.log(session_id);
    const visit_id = await this.analyticsRepository.upsertVisit({
      iso2,
      referrer: data.referrer,
      user_agent: data.user_agent,
      app_key: data.app_key,
      session_id,
    });

    await this.analyticsRepository.createPageView({
      visit_id,
      path: data.path,
    });

    return {
      success: true,
    };
  }
}

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Pool as MyPGPool } from 'pg';

@Injectable()
export class AnalyticsRepository {
  constructor(@Inject('POSTGRESQL_CONNECTION') private pg: MyPGPool) { }

  async createVisit({
    appKey,
    visitId,
    sessionId,
    timezone,
    country,
    iso2,
    referrer,
    ipAddress,
    page,
    userAgent,
    origin
  }: {
    appKey: string;
    visitId: string;
    sessionId: string;
    timezone: string;
    country: string;
    iso2: string;
    referrer: string;
    ipAddress: string;
    page: string;
    userAgent: string;
    origin: string;
  }) {


    const query = `
    INSERT INTO visit (app_id, session_id, timezone, country, referrer, ip_address, page, user_agent, visit_id, iso2, origin)
    SELECT id, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 FROM app WHERE app_key = $11
    RETURNING app_id;
  `;

    const result = await this.pg.query(query, [
      sessionId,
      timezone,
      country,
      referrer,
      ipAddress,
      page,
      userAgent,
      visitId,
      iso2,
      origin,
      appKey

    ]);

    if (result.rowCount === 0) {
      throw new HttpException('Invalid appKey', HttpStatus.BAD_REQUEST);
    }
  }
}

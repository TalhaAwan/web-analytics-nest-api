import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Pool as MyPGPool } from 'pg';
import { CreateVisitDto } from './dto/analytics.dto';

@Injectable()
export class AnalyticsRepository {
  constructor(@Inject('POSTGRESQL_CONNECTION') private pg: MyPGPool) {}

  async upsertVisit(data: {
    iso2: string;
    referrer?: string;
    timezone?: string;
    user_agent: string;
    app_key: string;
    session_id: string;
  }): Promise<number> {
    const client = await this.pg.connect();
    try {
      await client.query('BEGIN');

      const findQuery = `
        SELECT id FROM visit WHERE session_id = $1
      `;
      const found = await client.query(findQuery, [data.session_id]);
      if (found.rows.length > 0) {
        await client.query('COMMIT');
        return found.rows[0].id;
      }

      const insertQuery = `
        INSERT INTO visit (app_id, session_id, timezone, iso2, referrer, user_agent)
        SELECT id, $1, $2, $3, $4, $5 FROM app WHERE app_key = $6
        RETURNING id;
      `;
      const result = await client.query(insertQuery, [
        data.session_id,
        data.timezone,
        data.iso2,
        data.referrer,
        data.user_agent,
        data.app_key,
      ]);

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        throw new HttpException('Invalid app_key', HttpStatus.BAD_REQUEST);
      }

      await client.query('COMMIT');
      return result.rows[0].id;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async createPageView(data: {
    visit_id: number;
    path: string;
  }): Promise<void> {
    const query = `
      INSERT INTO page_view (visit_id, path)
      VALUES ($1, $2)
    `;
    await this.pg.query(query, [data.visit_id, data.path]);
  }
}

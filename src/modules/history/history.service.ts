import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { QueryResult } from 'pg';
import { DrizzleAsyncProvider } from 'src/providers/drizzle.provider';
import { v4 as uuidv4 } from 'uuid';
import * as schemas from '../../schema/schema';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private database: NodePgDatabase<typeof schemas>,
  ) {}
  async create(
    createHistoryDto: CreateHistoryDto[],
  ): Promise<QueryResult<never>> {
    const data = createHistoryDto.map((param) => ({
      id: uuidv4(),
      entity_id: param.entityId,
      detail: param.detail,
      user_id: param.userId,
      data: param.data,
      action: param.action,
    }));
    return await this.database.insert(schemas.history).values(data);
  }

  async createHistoryUpdate(
    updateHistoryDto: UpdateHistoryDto,
  ): Promise<QueryResult<never>> {
    const data = {
      id: uuidv4(),
      entity_id: updateHistoryDto.entityId,
      detail: updateHistoryDto.detail,
      user_id: updateHistoryDto.userId,
      data: updateHistoryDto.data,
      action: updateHistoryDto.action,
    };
    return await this.database.insert(schemas.history).values(data);
  }
}

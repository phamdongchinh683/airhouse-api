import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { desc, eq, gt, inArray, lt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { ActionEvent } from 'src/global/globalEnum';
import { PaginationResult } from 'src/global/globalPagination';
import { DrizzleAsyncProvider } from 'src/providers/drizzle.provider';
import { v4 as uuidv4 } from 'uuid';
import * as schemas from '../../schema/schema';
import { CreateHistoryDto } from '../history/dto/create-history.dto';
import { UpdateHistoryDto } from '../history/dto/update-history.dto';
import { HistoryService } from '../history/history.service';
import { CreateBuildingPhoneNumberDto } from './dto/create-building-phone-number.dto';
import { CreateBuildingDto } from './dto/create-building.dto';
import { DeleteBuildingByIdsDto } from './dto/delete-building-by-ids.dto';
import { PaginationBuildingDto } from './dto/pagination-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(DrizzleAsyncProvider)
    private database: NodePgDatabase<typeof schemas>,
    private historyService: HistoryService,
  ) {}

  async create(
    creationBuilding: CreateBuildingDto[],
    userId: string,
  ): Promise<any> {
    return await this.database.transaction(async (tx) => {
      const checkProjectCode = await this.database
        .select({
          projectCode: schemas.building.project_code,
        })
        .from(schemas.building)
        .where(
          inArray(
            schemas.building.project_code,
            creationBuilding.map((building) => building.projectCode),
          ),
        );

      if (checkProjectCode.length > 0) {
        return {
          duplicates: checkProjectCode.map((b) => b.projectCode),
        };
      }

      const buildingData: any[] = creationBuilding.map((building) => ({
        id: uuidv4(),
        project_code: building.projectCode,
        building_image: building.buildingImage,
        address: building.address,
        room_quantity: building.roomQuantity,
        room_available: building.roomAvailable,
        shared_facilities: building.sharedFacilities,
        commission: building.commission,
        costs: building.costs,
        source: building.source,
        note: building.note,
      }));

      const insertBuilding = await this.database
        .insert(schemas.building)
        .values(buildingData)
        .returning({ insertedId: schemas.building.id });

      if (insertBuilding.length === 0) {
        return 'There are no changes when adding data building';
      }

      const insertPhoneNumber: CreateBuildingPhoneNumberDto[] =
        creationBuilding.map((param, index) => ({
          id: uuidv4(),
          buildingId: insertBuilding[index].insertedId,
          phoneNumber: param.phoneNumber,
        }));

      if (insertBuilding.length === 0) {
        return 'Empty data building phone number';
      }

      const result = await this.insertPhoneNumber(insertPhoneNumber);

      if (result.rowCount <= 0) {
        return 'There are no changes when adding building phone number';
      }

      const dataNewHistory: CreateHistoryDto[] = creationBuilding.map(
        (building, index) => ({
          id: uuidv4(),
          entityId: insertBuilding[index].insertedId,
          detail: `Create building ${building.projectCode}`,
          userId: userId,
          data: JSON.stringify(creationBuilding[index]),
          action: ActionEvent.Create,
        }),
      );
      const newHistory = await this.historyService.create(dataNewHistory);

      if (newHistory.rowCount <= 0) {
        tx.rollback();
        return 'There are no changes when adding building history';
      }
      return 'Create building';
    });
  }

  async update(
    updateBuildingDto: UpdateBuildingDto,
    buildingId: string,
    userId: string,
  ): Promise<string> {
    const updateBuilding = await this.database
      .update(schemas.building)
      .set({
        project_code: updateBuildingDto.projectCode,
        building_image: updateBuildingDto.buildingImage,
        address: updateBuildingDto.address,
        room_quantity: updateBuildingDto.roomQuantity,
        room_available: updateBuildingDto.roomAvailable,
        shared_facilities: updateBuildingDto.sharedFacilities,
        commission: updateBuildingDto.commission,
        costs: updateBuildingDto.costs,
        source: updateBuildingDto.source,
        note: updateBuildingDto.note,
      })
      .where(eq(schemas.building.id, buildingId))
      .returning({
        id: schemas.building.id,
        projectCode: schemas.building.project_code,
      });

    if (updateBuilding.length === 0) {
      return `Not found this building ${buildingId}`;
    }

    const updatePhoneNumber = await this.database
      .update(schemas.buildingPhoneNumber)
      .set({
        phone_number: updateBuildingDto.phoneNumber,
      })
      .where(eq(schemas.buildingPhoneNumber.building_id, updateBuilding[0].id));

    if (updatePhoneNumber.rowCount <= 0) {
      return 'There are no changes when adding building phone number';
    }

    const dataNewHistory: UpdateHistoryDto = {
      id: uuidv4(),
      entityId: updateBuilding[0].id,
      detail: ` Update building ${updateBuilding[0].projectCode}`,
      userId: userId,
      data: JSON.stringify(updateBuilding[0]),
      action: ActionEvent.Update,
    };

    const newHistory =
      await this.historyService.createHistoryUpdate(dataNewHistory);
    return newHistory.rowCount > 0
      ? 'Updated'
      : 'There are no changes when adding building history';
  }

  async delete(deleteByIds: DeleteBuildingByIdsDto[]): Promise<string> {
    const result = await this.database.delete(schemas.building).where(
      inArray(
        schemas.building.id,
        deleteByIds.map((building) => building.id),
      ),
    );
    return result.rowCount > 0 ? 'Deleted' : `This buildings not exited`;
  }

  async deleteById(id: string): Promise<string> {
    const result = await this.database
      .delete(schemas.building)
      .where(eq(schemas.building.id, id));
    return result.rowCount > 0
      ? 'Deleted this building'
      : `This building ${id} not exited`;
  }

  async insertPhoneNumber(
    CreateBuildingPhoneNumberDto: CreateBuildingPhoneNumberDto[],
  ) {
    const data = CreateBuildingPhoneNumberDto.map((param) => ({
      id: param.id,
      building_id: param.buildingId,
      phone_number: param.phoneNumber,
    }));

    return await this.database.insert(schemas.buildingPhoneNumber).values(data);
  }

  async buildingPagination(
    paginationDto: PaginationBuildingDto,
  ): Promise<PaginationResult | null> {
    const { cursor, page, limit, direction } = paginationDto;
    let count: number;
    const cachedCount = await this.cacheManager.get<number>('count_buildings');

    if (cachedCount !== null && cachedCount !== undefined) {
      count = cachedCount;
    } else {
      count = await this.database.$count(schemas.building);
      await this.cacheManager.set('count_buildings', count, 300);
    }

    const pages = Math.ceil(count / limit);
    const offset = (page - 1) * limit;
    if (page > pages) {
      return null;
    }

    let results: any;
    const query = this.database
      .select()
      .from(schemas.building)
      .orderBy(desc(schemas.building.created_at))
      .limit(limit);

    if (cursor) {
      const pageDirection =
        direction === 'next'
          ? gt(schemas.building.id, cursor) // this is next page
          : lt(schemas.building.id, cursor); // this is prev page
      results = await query.where(pageDirection); // with condition page direction use where query data
    } else {
      results = await query.offset(offset); // default query data
    }

    return new PaginationResult(
      results.length > 0 ? results : [], // results data
      page, // current page
      results.length ? results[results.length - 1].id : undefined, // next cursor
      results.length ? results[0].id : undefined, // prev cursor
      results.length, // total items
      limit, // limit
      pages, // how many pages example: page: 1/20 or 2/20 (20 pages)
    );
  }

  async buildingDetail(id: string) {
    return await this.database
      .select()
      .from(schemas.building)
      .leftJoin(
        schemas.buildingPhoneNumber,
        eq(schemas.buildingPhoneNumber.building_id, schemas.building.id),
      )
      .where(eq(schemas.building.id, id));
  }
}

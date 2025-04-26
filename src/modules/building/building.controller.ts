import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { ResponseData } from 'src/global/globalClass';
import { httpMessage, httpStatus, Role } from 'src/global/globalEnum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { BuildingService } from './building.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { DeleteBuildingByIdsDto } from './dto/delete-building-by-ids.dto';
import { PaginationBuildingDto } from './dto/pagination-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@ApiBearerAuth()
@ApiTags('building')
@UseGuards(AuthGuard, RolesGuard) // apply authentication authorization for controller this
@UseInterceptors(CacheInterceptor)
@Controller('api/v1/building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @ApiBody({
    type: [CreateBuildingDto],
  })
  @Roles(Role.Admin, Role.ProjectManagement)
  @Post()
  async createBuilding(@Req() req: Request, @Body() data: CreateBuildingDto[]) {
    try {
      const result = await this.buildingService.create(data, req['user'].sub);
      return new ResponseData<any>(
        result,
        httpStatus.SUCCESS,
        httpMessage.SUCCESS,
      );
    } catch (e: any) {
      return new ResponseData<string>(
        e.message,
        httpStatus.ERROR,
        httpMessage.ERROR,
      );
    }
  }

  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    default: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    enum: [10, 50, 100],
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'direction',
    required: true,
    type: String,
    enum: ['next', 'prev'],
  })
  @Roles(Role.Admin, Role.ProjectManagement)
  @Get()
  async getAllBuilding(
    @Query()
    query: PaginationBuildingDto,
  ) {
    try {
      const parameters = new PaginationBuildingDto(query);
      const result = await this.buildingService.buildingPagination(parameters);
      return new ResponseData<any>(
        result,
        httpStatus.SUCCESS,
        httpMessage.SUCCESS,
      );
    } catch (e: any) {
      return new ResponseData<string>(
        e.message,
        httpStatus.ERROR,
        httpMessage.ERROR,
      );
    }
  }

  @Roles(Role.Admin, Role.ProjectManagement)
  @Patch(':id')
  async updateBuilding(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() data: UpdateBuildingDto,
  ) {
    try {
      const result = await this.buildingService.update(
        data,
        id,
        req['user'].sub,
      );
      return new ResponseData<any>(
        result,
        httpStatus.SUCCESS,
        httpMessage.SUCCESS,
      );
    } catch (e: any) {
      return new ResponseData<string>(
        e.message,
        httpStatus.ERROR,
        httpMessage.ERROR,
      );
    }
  }

  @Roles(Role.Admin, Role.ProjectManagement)
  @Delete(':id')
  async deleteById(@Req() req: Request, @Param('id') id: string) {
    try {
      const result = await this.buildingService.deleteById(id);
      return new ResponseData<string>(
        result,
        httpStatus.SUCCESS,
        httpMessage.SUCCESS,
      );
    } catch (e: any) {
      return new ResponseData<string>(
        e.message,
        httpStatus.ERROR,
        httpMessage.ERROR,
      );
    }
  }

  @Roles(Role.Admin, Role.ProjectManagement)
  @Delete('delete-buildings')
  @ApiBody({
    type: [DeleteBuildingByIdsDto],
  })
  async deleteByIds(@Body() ids: DeleteBuildingByIdsDto[]) {
    try {
      const result = await this.buildingService.delete(ids);
      return new ResponseData<string>(
        result,
        httpStatus.SUCCESS,
        httpMessage.SUCCESS,
      );
    } catch (e: any) {
      return new ResponseData<string>(
        e.message,
        httpStatus.ERROR,
        httpMessage.ERROR,
      );
    }
  }

  @Roles(Role.Admin, Role.ProjectManagement)
  @Get(':id')
  async detail(@Req() req: Request, @Param('id') id: string) {
    try {
      const result = await this.buildingService.buildingDetail(id);
      return new ResponseData<any>(
        result,
        httpStatus.SUCCESS,
        httpMessage.SUCCESS,
      );
    } catch (e: any) {
      return new ResponseData<string>(
        e.message,
        httpStatus.ERROR,
        httpMessage.ERROR,
      );
    }
  }
}

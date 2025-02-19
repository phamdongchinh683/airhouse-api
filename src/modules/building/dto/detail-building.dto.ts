import { HistoryEntityDto } from 'src/modules/history/dto/history-entity.dto';

export interface DetailBuildingDto {
  building: {
    id: string;
    projectCode: string;
    buildingImage: string;
    address: string;
    roomQuantity: number;
    roomAvailable: number;
    sharedFacilities: string;
    commission: string;
    costs: string;
    source: string;
    note: string;
    phoneNumber: string;
  };
  histories: HistoryEntityDto[] | string;
}

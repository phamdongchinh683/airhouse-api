import { IsEnum, IsNotEmpty } from 'class-validator';
import { ActionEvent } from 'src/global/globalEnum';

export class NewBuildingEventDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  entity_id: string;
  @IsNotEmpty()
  @IsEnum(ActionEvent)
  action: ActionEvent;
  @IsNotEmpty()
  user_id: string;
}

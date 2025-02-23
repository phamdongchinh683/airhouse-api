import { IsEnum, IsNotEmpty } from 'class-validator';
import { ActionEvent } from 'src/global/globalEnum';
export class CreateHistoryDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  entityId: string;
  @IsNotEmpty()
  detail: string;
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  data: string;
  @IsEnum(ActionEvent)
  action: ActionEvent;
}

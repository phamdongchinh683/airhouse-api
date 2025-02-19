import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AwsService } from './aws.service';
import { FileUploadDto } from './dto/file-upload.dto';
import { FilesUploadDto } from './dto/files-upload.dto';

@ApiTags('aws')
@Controller('api/aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    return this.awsService.uploadFile(file);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
  })
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
  }
}

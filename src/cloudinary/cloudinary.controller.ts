import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
// import { v2 as cloudinary } from 'cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadedFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 50,
            message: 'very large size',
          }),
          // new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // console.log('new file', file);
    return this.cloudinaryService.uploadFile(file);
  }

  @Delete(':publicId')
  deleteFile(@Param('publicId') publicId: string) {
    return this.cloudinaryService.deleteFile(publicId);
  }
}

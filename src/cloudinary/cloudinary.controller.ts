import { Controller, Post } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  async UploadedFile() {
    // cloudinary.config({
    //   cloud_name: 'daswkls85',
    //   api_key: '456839817517438',
    //   api_secret: '8myAm2mvR7vd9SYJFYBXzy6hlEU',
    //   secure: true,
    // });
    // console.log('config', cloudinary.config());
    // cloudinary.uploader.upload(
    //   'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
    //   { public_id: 'olympic_flag_02' },
    //   function (error, result) {
    //     console.log('result v2', result, error);
    //   },
    // );
    return true;
  }
}

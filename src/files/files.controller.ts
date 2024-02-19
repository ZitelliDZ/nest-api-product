import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configServise: ConfigService
    ) {}


  @Get('product/:fileName')
  async findFileProduct(
    @Res() res: Response,
    @Param('fileName') fileName: string
    ) {
    
    const path = this.filesService.getStaticProductFile(fileName);
    res.sendFile(path );
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter,
    //limits: { fieldSize: 1000000 }
    storage: diskStorage({
      destination: './static/uploads/products',
      filename: fileNamer
    
    })
  }) )
  uploadFileProduct(@UploadedFile() file: Express.Multer.File) {

    const secureUrl = `${this.configServise.get('HOST')}:${this.configServise.get('PORT')}/api/files/product/${file.filename}`

    return {filename: secureUrl}
  }
}

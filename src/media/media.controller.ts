import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  Delete, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MediaService } from './media.service';
import { extname } from 'path';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.saveFile(file);
  }

  @Get()
  listFiles() {
    return this.mediaService.listFiles();
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const stream = await this.mediaService.getFileStream(filename);
    stream.pipe(res);
  }

  @Delete(':filename')
  deleteFile(@Param('filename') filename: string) {
    return this.mediaService.deleteFile(filename);
  }

  @Get('processed/:filename')
  async getProcessedFile(@Param('filename') filename: string, @Res() res: Response) {
    const processedPath = `uploads/processed/${filename}`;
    if (!fs.existsSync(processedPath)) {
      return res.status(404).send('File not found');
    }
    const stream = fs.createReadStream(processedPath);
    stream.pipe(res);
  }

  @Get('processed')
  async listProcessed() {
    return this.mediaService.listProcessedFiles();
  }

  @Get('search')
  search(
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.mediaService.searchFiles({
      q,
      type,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }
}

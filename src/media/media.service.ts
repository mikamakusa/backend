import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import * as ffmpeg from 'fluent-ffmpeg';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  private readonly uploadPath = path.resolve(__dirname, '../../uploads');
  private readonly processedPath = path.resolve(this.uploadPath, 'processed');
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async saveFile(file: Express.Multer.File): Promise<{ original: string; processed?: string }> {
    const ext = path.extname(file.filename).toLowerCase();
    let processedName: string | undefined;
    let type = 'other';

    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      type = 'image';
      processedName = `resized-${file.filename}`;
      await sharp(file.path)
        .resize({ width: 800 })
        .toFile(path.join(this.processedPath, processedName));
    } else if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
      type = 'video';
      processedName = `transcoded-${file.filename.split('.')[0]}.mp4`;
      await this.transcodeVideo(file.path, path.join(this.processedPath, processedName));
    }

    // Enregistrement en base
    await this.prisma.media.create({
      data: {
        original: file.filename,
        processed: processedName,
        type,
      },
    });

    return { original: file.filename, processed: processedName };
  }

  private transcodeVideo(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  async listFiles(): Promise<string[]> {
    return fs.readdirSync(this.uploadPath).filter(f => f !== 'processed');
  }

  async getFileStream(filename: string) {
    const filePath = path.join(this.uploadPath, filename);
    return fs.createReadStream(filePath);
  }

  async deleteFile(filename: string) {
    const filePath = path.join(this.uploadPath, filename);
    fs.unlinkSync(filePath);
  }

  async listProcessedFiles() {
    return this.prisma.media.findMany({
      where: {
        processed: {
          not: null,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchFiles({
    q,
    type,
    page = 1,
    limit = 10,
  }: {
    q?: string;
    type?: string;
    page: number;
    limit: number;
  }) {
    const where: any = {};

    if (q) {
      where.OR = [
        { original: { contains: q, mode: 'insensitive' } },
        { processed: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.media.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data,
    };
  }
}
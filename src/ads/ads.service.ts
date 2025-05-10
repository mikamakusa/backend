import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Ad } from '@prisma/client';

@Injectable()
export class AdsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ad: Ad) {
    return this.prisma.ad.create({ data: ad });
  }

  async findAllActive() {
    const now = new Date();
    return this.prisma.ad.findMany({
      where: {
        active: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number) {
    return this.prisma.ad.delete({ where: { id } });
  }

  async incrementClick(id: number) {
    return this.prisma.ad.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
  }
  update(id: number, data: Partial<Ad>) {
    return this.prisma.ad.update({ where: { id }, data });
  }
}

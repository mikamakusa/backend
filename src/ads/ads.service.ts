import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Ad } from '@prisma/client';

@Injectable()
export class AdsService {
  constructor(private readonly prisma: PrismaService) {}

  async logStat(adId: string, type: 'VIEW' | 'CLICK', meta: { userId?: string, ip?: string, userAgent?: string }) {
    // Incrémente compteur rapide
    const field = type === 'VIEW' ? { views: { increment: 1 } } : { clicks: { increment: 1 } };

    await this.prisma.ad.update({
      where: { id: adId },
      data: field,
    });

    return this.prisma.adStat.create({
      data: {
        type,
        adId,
        userId: meta.userId,
        ip: meta.ip,
        userAgent: meta.userAgent,
      },
    });
  }


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

  async remove(id: string) {
    return this.prisma.ad.delete({ where: { id } });
  }

  async incrementClick(id: string) {
    return this.prisma.ad.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
  }

  update(id: string, data: Partial<Ad>) {
    return this.prisma.ad.update({ where: { id }, data });
  }

  async getActiveAds() {
    const ads = await this.prisma.ad.findMany({
      where: {
        active: true,
        OR: [
          { startsAt: null },
          { startsAt: { lte: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return ads;
  }

  isCurrentlyActive(ad: Ad): boolean {
    const now = new Date();

    const withinDates =
      (!ad.startsAt || ad.startsAt <= now) &&
      (!ad.endsAt || ad.endsAt >= now);

    return ad.active && withinDates;
  }

}
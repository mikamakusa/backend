import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { AdsService } from './ads.service';
import { Ad } from '@prisma/client';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  create(@Body() body) {
    return this.adsService.create(body);
  }

  @Get('active')
  findAllActive() {
    return this.adsService.findAllActive();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<Ad>) {
    return this.adsService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adsService.remove(+id);
  }

  @Post(':id/click')
  async trackClick(@Param('id') id: string) {
    await this.adsService.incrementClick(+id);
    return { success: true };
  }
}

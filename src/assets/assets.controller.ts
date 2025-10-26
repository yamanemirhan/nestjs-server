import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Param,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Get('category/:categoryId')
  @HttpCode(HttpStatus.OK)
  findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.assetsService.findByCategoryId(categoryId);
  }
}

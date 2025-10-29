import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from 'src/auth/auth.guard'; // Mevcut AuthGuard'ınızı kullanıyoruz
import { ReviewIdParamDto } from './dto/review-id-param.dto';

@Controller('reviews')
@UseGuards(AuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    const userId = req.user.sub;
    return this.reviewsService.create(createReviewDto, userId);
  }

  @Get(':reviewId')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param() params: ReviewIdParamDto) {
    return this.reviewsService.findOne(params.reviewId);
  }

  @Get('asset/:assetId')
  @HttpCode(HttpStatus.OK)
  async findByAsset(@Param('assetId') assetId: string) {
    return this.reviewsService.findByAssetId(assetId);
  }

  @Get('get/latest')
  @HttpCode(HttpStatus.OK)
  async findLatest() {
    return this.reviewsService.findLatest();
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Result } from 'src/common/base-response.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<Result<ReviewResponseDto>> {
    const asset = await this.databaseService.asset.findUnique({
      where: { id: createReviewDto.assetId },
    });

    if (!asset) {
      throw new NotFoundException('Asset bulunamadı.');
    }

    const existingReview = await this.databaseService.review.findUnique({
      where: {
        userId_assetId: {
          userId: userId,
          assetId: createReviewDto.assetId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Bu asset için zaten bir inceleme yaptınız.',
      );
    }

    const newReview = await this.databaseService.review.create({
      data: {
        overallRating: createReviewDto.overallRating,
        comment: createReviewDto.comment,
        dynamicData: createReviewDto.dynamicData,
        locationLatitude: createReviewDto.locationLatitude,
        locationLongitude: createReviewDto.locationLongitude,
        userId: userId,
        assetId: createReviewDto.assetId,
      },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            email: true,
          },
        },
        asset: {
          select: {
            id: true,
            title: true,
            brand: true,
            model: true,
          },
        },
      },
    });

    await this.updateAssetAverageRating(createReviewDto.assetId);

    const reviewResponse = new ReviewResponseDto({
      id: newReview.id,
      assetId: newReview.assetId,
      userId: newReview.userId,
      overallRating: newReview.overallRating,
      helpfulCount: newReview.helpfulCount,
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt,
      user: newReview.user,
    });

    return {
      success: true,
      statusCode: 201,
      data: reviewResponse,
      message: 'İnceleme başarıyla oluşturuldu.',
    };
  }

  async findOne(reviewId: string): Promise<Result<ReviewResponseDto>> {
    const review = await this.databaseService.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            email: true,
          },
        },
        asset: {
          select: {
            id: true,
            title: true,
            brand: true,
            model: true,
          },
        },
        media: true,
        comments: {
          include: {
            user: {
              select: {
                userId: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('İnceleme bulunamadı.');
    }

    const reviewResponse = new ReviewResponseDto({
      id: review.id,
      assetId: review.assetId,
      userId: review.userId,
      overallRating: review.overallRating,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: review.user,
      media: review.media,
      comments: review.comments,
    });

    return {
      success: true,
      statusCode: 200,
      data: reviewResponse,
      message: 'İnceleme başarıyla getirildi.',
    };
  }

  async findByAsset(assetId: string): Promise<Result<ReviewResponseDto[]>> {
    const reviews = await this.databaseService.review.findMany({
      where: { assetId },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
          },
        },
        media: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const reviewsResponse = reviews.map(
      (review) =>
        new ReviewResponseDto({
          id: review.id,
          assetId: review.assetId,
          userId: review.userId,
          overallRating: review.overallRating,
          helpfulCount: review.helpfulCount,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          user: review.user,
          media: review.media,
        }),
    );

    return {
      success: true,
      statusCode: 200,
      data: reviewsResponse,
      message: 'İncelemeler başarıyla getirildi.',
    };
  }

  async findByUser(userId: string): Promise<Result<ReviewResponseDto[]>> {
    const reviews = await this.databaseService.review.findMany({
      where: { userId },
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            brand: true,
            model: true,
          },
        },
        media: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const reviewsResponse = reviews.map(
      (review) =>
        new ReviewResponseDto({
          id: review.id,
          assetId: review.assetId,
          userId: review.userId,
          overallRating: review.overallRating,

          helpfulCount: review.helpfulCount,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          media: review.media,
        }),
    );

    return {
      success: true,
      statusCode: 200,
      data: reviewsResponse,
      message: 'Kullanıcı incelemeleri başarıyla getirildi.',
    };
  }

  async remove(reviewId: string, userId: string): Promise<Result<void>> {
    const review = await this.databaseService.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('İnceleme bulunamadı.');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('Bu incelemeyi silme yetkiniz yok.');
    }

    await this.databaseService.review.delete({
      where: { id: reviewId },
    });

    await this.updateAssetAverageRating(review.assetId);

    return {
      success: true,
      statusCode: 200,
      message: 'İnceleme başarıyla silindi.',
    };
  }

  private async updateAssetAverageRating(assetId: string): Promise<void> {
    const reviews = await this.databaseService.review.findMany({
      where: { assetId },
      select: { overallRating: true },
    });

    const reviewCount = reviews.length;
    const generalAverage =
      reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviewCount
        : 0;

    await this.databaseService.asset.update({
      where: { id: assetId },
      data: {
        generalAverage,
        reviewCount,
      },
    });
  }

  async markAsHelpful(reviewId: string): Promise<Result<void>> {
    const review = await this.databaseService.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('İnceleme bulunamadı.');
    }

    await this.databaseService.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'İnceleme faydalı olarak işaretlendi.',
    };
  }
}

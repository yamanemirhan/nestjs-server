import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Result } from 'src/common/base-response.dto';
import { DatabaseService } from 'src/database/database.service';
import { AssetResponseDto } from './dto/asset-response.dto';
import { CategoryResponseDto } from 'src/categories/dto/category-response.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createAssetDto: CreateAssetDto,
  ): Promise<Result<AssetResponseDto>> {
    const existingAsset = await this.databaseService.asset.findFirst({
      where: { title: createAssetDto.title },
    });

    if (existingAsset) {
      throw new BadRequestException('Bu başlık ile zaten bir varlık mevcut.');
    }

    const newAsset = await this.databaseService.asset.create({
      data: {
        title: createAssetDto.title,
        description: createAssetDto.description,
        brand: createAssetDto.brand,
        model: createAssetDto.model,
        locationLatitude: createAssetDto.locationLatitude,
        locationLongitude: createAssetDto.locationLongitude,
        categoryId: createAssetDto.categoryId,
      },
    });

    const assetResponse = new AssetResponseDto({
      id: newAsset.id,
      title: newAsset.title,
      description: newAsset.description ?? undefined,
      createdAt: newAsset.createdAt,
      updatedAt: newAsset.updatedAt,
      brand: newAsset.brand ?? undefined,
      model: newAsset.model ?? undefined,
      locationLatitude: newAsset.locationLatitude ?? undefined,
      locationLongitude: newAsset.locationLongitude ?? undefined,
      categoryId: newAsset.categoryId ?? undefined,
    });

    return {
      success: true,
      statusCode: 201,
      data: assetResponse,
      message: 'Varlık başarıyla oluşturuldu.',
    };
  }

  async findAll(): Promise<Result<AssetResponseDto[]>> {
    const assets = await this.databaseService.asset.findMany();

    const assetResponses = assets.map(
      (asset) =>
        new AssetResponseDto({
          id: asset.id,
          title: asset.title,
          description: asset.description ?? undefined,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt,
          brand: asset.brand ?? undefined,
          model: asset.model ?? undefined,
          locationLatitude: asset.locationLatitude ?? undefined,
          locationLongitude: asset.locationLongitude ?? undefined,
          categoryId: asset.categoryId ?? undefined,
          generalAverage: asset.generalAverage ?? undefined,
          reviewCount: asset.reviewCount ?? undefined,
          categoryAverages:
            typeof asset.categoryAverages === 'string'
              ? JSON.parse(asset.categoryAverages)
              : (asset.categoryAverages as Record<string, number> | undefined),
        }),
    );

    return {
      success: true,
      statusCode: 200,
      data: assetResponses,
      message: 'Varlıklar başarıyla listelendi.',
    };
  }

  async findOne(id: string): Promise<Result<AssetResponseDto>> {
    const asset = await this.databaseService.asset.findUnique({
      where: { id },
    });
    if (!asset) {
      throw new NotFoundException('Varlık bulunamadı.');
    }
    const assetResponse = new AssetResponseDto({
      id: asset.id,
      title: asset.title,
      description: asset.description ?? undefined,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      brand: asset.brand ?? undefined,
      model: asset.model ?? undefined,
      locationLatitude: asset.locationLatitude ?? undefined,
      locationLongitude: asset.locationLongitude ?? undefined,
      categoryId: asset.categoryId ?? undefined,
      generalAverage: asset.generalAverage ?? undefined,
      reviewCount: asset.reviewCount ?? undefined,
    });

    return {
      success: true,
      statusCode: 200,
      data: assetResponse,
      message: 'Varlık başarıyla bulundu.',
    };
  }

  async findByCategoryId(
    categoryId: string,
  ): Promise<Result<AssetResponseDto[]>> {
    const assets = await this.databaseService.asset.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!assets || assets.length === 0) {
      throw new NotFoundException('Bu kategoriye ait varlık bulunamadı.');
    }

    const assetResponses = assets.map(
      (asset) =>
        new AssetResponseDto({
          id: asset.id,
          title: asset.title,
          description: asset.description ?? undefined,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt,
          brand: asset.brand ?? undefined,
          model: asset.model ?? undefined,
          locationLatitude: asset.locationLatitude ?? undefined,
          locationLongitude: asset.locationLongitude ?? undefined,
          categoryId: asset.categoryId,
          category: new CategoryResponseDto({
            id: asset.category.id,
            name: asset.category.name,
            slug: asset.category.slug,
            description: asset.category.description ?? undefined,
            formFields: asset.category.formFields as any,
            createdAt: asset.category.createdAt,
            updatedAt: asset.category.updatedAt,
          }),
          generalAverage: asset.generalAverage,
          reviewCount: asset.reviewCount,
          categoryAverages: asset.categoryAverages
            ? (asset.categoryAverages as Record<string, number>)
            : undefined,
        }),
    );

    return {
      success: true,
      statusCode: 200,
      data: assetResponses,
      message: 'Varlıklar başarıyla listelendi.',
    };
  }
}

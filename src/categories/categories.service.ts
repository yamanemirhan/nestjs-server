import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Result } from 'src/common/base-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Result<CategoryResponseDto>> {
    const existingCategory = await this.databaseService.category.findFirst({
      where: {
        OR: [
          { name: createCategoryDto.name },
          { slug: createCategoryDto.slug },
        ],
      },
    });

    if (existingCategory) {
      throw new BadRequestException(
        'Bu isim veya slug ile bir kategori zaten mevcut.',
      );
    }

    const newCategory = await this.databaseService.category.create({
      data: {
        name: createCategoryDto.name,
        slug: createCategoryDto.slug,
        description: createCategoryDto.description,
        formFields: JSON.parse(JSON.stringify(createCategoryDto.formFields)),
      },
    });

    const categoryResponse = new CategoryResponseDto({
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description ?? undefined,
      formFields: newCategory.formFields as any,
      createdAt: newCategory.createdAt,
      updatedAt: newCategory.updatedAt,
    });

    return {
      success: true,
      statusCode: 201,
      data: categoryResponse,
      message: 'Kategori başarıyla oluşturuldu.',
    };
  }

  async findAll(): Promise<Result<CategoryResponseDto[]>> {
    const categories = await this.databaseService.category.findMany();

    const categoryResponses = categories.map(
      (category) =>
        new CategoryResponseDto({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description ?? undefined,
          formFields: category.formFields as any,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        }),
    );

    return {
      success: true,
      statusCode: 200,
      data: categoryResponses,
      message: 'Kategoriler başarıyla listelendi.',
    };
  }

  async findOne(id: string): Promise<Result<CategoryResponseDto>> {
    const category = await this.databaseService.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Kategori bulunamadı.');
    }

    const categoryResponse = new CategoryResponseDto({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      formFields: category.formFields as any,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });

    return {
      success: true,
      statusCode: 200,
      data: categoryResponse,
      message: 'Kategori başarıyla bulundu.',
    };
  }
}

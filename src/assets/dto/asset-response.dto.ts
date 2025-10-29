import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from 'src/categories/dto/category-response.dto';

@Exclude()
export class AssetResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Asset ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Asset başlığı (örnek: Hilton İstanbul, iPhone 17 Pro)',
    example: 'Hilton İstanbul',
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: 'Marka bilgisi',
    example: 'Hilton',
    required: false,
  })
  brand?: string;

  @Expose()
  @ApiProperty({
    description: 'Model bilgisi',
    example: 'Deluxe Suite',
    required: false,
  })
  model?: string;

  @Expose()
  @ApiProperty({
    description: 'Açıklama',
    example: 'Boğaz manzaralı lüks otel odası',
    required: false,
  })
  description?: string;

  @Expose()
  @ApiProperty({
    description: 'Konum enlem (latitude)',
    example: 41.0082,
    required: false,
  })
  locationLatitude?: number;

  @Expose()
  @ApiProperty({
    description: 'Konum boylam (longitude)',
    example: 28.9784,
    required: false,
  })
  locationLongitude?: number;

  @Expose()
  @ApiProperty({
    description: 'Genel ortalama puan (1-5 arası)',
    example: 4.3,
  })
  generalAverage: number;

  @Expose()
  @ApiProperty({
    description: 'Toplam inceleme sayısı',
    example: 128,
  })
  reviewCount: number;

  @Expose()
  @ApiProperty({
    description: 'Kategoriye özel ortalama puanlar (dinamik alanlar)',
    example: {
      roomCleanliness: 4.5,
      locationAccess: 4.2,
      staffService: 4.8,
      breakfastQuality: 4.3,
    },
    required: false,
  })
  categoryAverages?: Record<string, number>;

  @Expose()
  @ApiProperty({
    description: 'Kategori bilgisi',
    type: () => CategoryResponseDto,
  })
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto;

  @Expose()
  @ApiProperty({
    description: 'Kategori ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  categoryId: string;

  @Expose()
  @ApiProperty({
    description: 'Oluşturulma tarihi',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Güncellenme tarihi',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<AssetResponseDto>) {
    Object.assign(this, partial);
  }
}

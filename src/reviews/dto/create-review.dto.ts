import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  IsObject,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReviewMediaCreateDto } from './create-review-media.dto';

export class CreateReviewDto {
  @ApiProperty({
    description: 'İncelenen asset ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({
    description: 'Genel puan (1-5 arası)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  overallRating: number;

  @ApiProperty({
    description: 'İnceleme yorumu',
    example: 'Harika bir deneyim yaşadım!',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: 'Kategoriye özgü dinamik veriler (JSON)',
    example: { temizlik: 5, konum: 4, fiyat: 3 },
  })
  @IsObject()
  @IsNotEmpty()
  dynamicData: Record<string, any>;

  @ApiProperty({
    description: 'Konum enlem',
    example: 41.0082,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  locationLatitude?: number;

  @ApiProperty({
    description: 'Konum boylam',
    example: 28.9784,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  locationLongitude?: number;

  @ApiProperty({
    description: 'İncelemeye eklenecek medya dosyaları (opsiyonel)',
    type: [ReviewMediaCreateDto],
    example: [
      {
        url: 'https://cdn.example.com/reviews/photo1.jpg',
        mediaType: 'image',
      },
    ],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReviewMediaCreateDto)
  media?: ReviewMediaCreateDto[];
}

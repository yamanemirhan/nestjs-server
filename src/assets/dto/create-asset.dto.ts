import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({
    description: 'Asset başlığı (örnek: Hilton İstanbul, iPhone 17 Pro)',
    example: 'Hilton İstanbul',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Marka bilgisi (opsiyonel)',
    example: 'Hilton',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string;

  @ApiProperty({
    description: 'Model bilgisi (opsiyonel)',
    example: 'Deluxe Suite',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  model?: string;

  @ApiProperty({
    description: 'Açıklama',
    example: 'Boğaz manzaralı lüks otel odası',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Konum enlem (latitude)',
    example: 41.0082,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  locationLatitude?: number;

  @ApiProperty({
    description: 'Konum boylam (longitude)',
    example: 28.9784,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  locationLongitude?: number;

  @ApiProperty({
    description: 'Kategori ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}

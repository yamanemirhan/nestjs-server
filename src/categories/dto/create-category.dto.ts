import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class FormFieldDto {
  @ApiProperty({
    description: 'Form alanının benzersiz anahtarı (snake_case)',
    example: 'temizlik',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'Form alanının görünen etiketi',
    example: 'Oda Temizliği',
  })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    description: 'Form alanı tipi',
    example: 'star_rating',
    enum: ['star_rating', 'text', 'number', 'select'],
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Alan zorunlu mu?',
    example: true,
  })
  @IsOptional()
  required?: boolean;

  @ApiProperty({
    description: 'Minimum değer (sayısal alanlar için)',
    example: 1,
    required: false,
  })
  @IsOptional()
  min?: number;

  @ApiProperty({
    description: 'Maximum değer (sayısal alanlar için)',
    example: 5,
    required: false,
  })
  @IsOptional()
  max?: number;

  @ApiProperty({
    description: 'Seçenekler listesi (select tipi için)',
    example: ['option1', 'option2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  options?: string[];
}

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Kategori adı',
    example: 'Otel',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Kategori slug (URL için, küçük harf ve tire ile)',
    example: 'hotel',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug sadece küçük harf, rakam ve tire içerebilir',
  })
  @MaxLength(100)
  slug: string;

  @ApiProperty({
    description: 'Kategori açıklaması',
    example: 'Otel ve konaklama tesisleri için değerlendirme kategorisi',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Kategoriye özgü form alanları',
    type: [FormFieldDto],
    example: [
      {
        key: 'temizlik',
        label: 'Oda Temizliği',
        type: 'star_rating',
        required: true,
        min: 1,
        max: 5,
      },
      {
        key: 'konum',
        label: 'Konum ve Erişim',
        type: 'star_rating',
        required: true,
        min: 1,
        max: 5,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  formFields: FormFieldDto[];
}

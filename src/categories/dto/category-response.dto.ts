import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

class FormField {
  @ApiProperty({
    description: 'Form alanının anahtarı',
    example: 'temizlik',
  })
  key: string;

  @ApiProperty({
    description: 'Form alanının etiketi',
    example: 'Oda Temizliği',
  })
  label: string;

  @ApiProperty({
    description: 'Form alanı tipi',
    example: 'star_rating',
  })
  type: string;

  @ApiProperty({
    description: 'Alan zorunlu mu?',
    example: true,
  })
  required?: boolean;

  @ApiProperty({
    description: 'Minimum değer',
    example: 1,
    required: false,
  })
  min?: number;

  @ApiProperty({
    description: 'Maximum değer',
    example: 5,
    required: false,
  })
  max?: number;

  @ApiProperty({
    description: 'Seçenekler listesi',
    example: ['option1', 'option2'],
    required: false,
  })
  options?: string[];
}

@Exclude()
export class CategoryResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Kategori ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Kategori adı',
    example: 'Otel',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Kategori slug',
    example: 'hotel',
  })
  slug: string;

  @Expose()
  @ApiProperty({
    description: 'Kategori açıklaması',
    example: 'Otel ve konaklama tesisleri için değerlendirme kategorisi',
    required: false,
  })
  description?: string;

  @Expose()
  @ApiProperty({
    description: 'Kategoriye özgü form alanları',
    type: [FormField],
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
  formFields: FormField[];

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

  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial);
  }
}

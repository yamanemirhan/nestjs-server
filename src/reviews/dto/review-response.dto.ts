import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReviewResponseDto {
  @Expose()
  @ApiProperty({
    description: 'İnceleme ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Asset ID',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  assetId: string;

  @Expose()
  @ApiProperty({
    description: 'Kullanıcı ID',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  userId: string;

  @Expose()
  @ApiProperty({
    description: 'Genel puan (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  overallRating: number;

  @Expose()
  @ApiProperty({
    description: 'İnceleme yorumu',
    example: 'Harika bir deneyim yaşadım!',
    required: false,
  })
  comment?: string;

  @Expose()
  @ApiProperty({
    description: 'Kategoriye özgü dinamik veriler (JSON)',
    example: { temizlik: 5, konum: 4, fiyat: 3, personel: 5 },
  })
  dynamicData: Record<string, any>;

  @Expose()
  @ApiProperty({
    description: 'Konum enlem',
    example: 41.0082,
    required: false,
  })
  locationLatitude?: number;

  @Expose()
  @ApiProperty({
    description: 'Konum boylam',
    example: 28.9784,
    required: false,
  })
  locationLongitude?: number;

  @Expose()
  @ApiProperty({
    description: 'Faydalılık sayısı - Kaç kişi bu incelemeyi faydalı buldu',
    example: 15,
  })
  helpfulCount: number;

  @Expose()
  @ApiProperty({
    description: 'İnceleme oluşturma tarihi',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'İnceleme güncellenme tarihi',
    example: '2024-01-16T14:20:00.000Z',
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    description: 'İncelemeyi yapan kullanıcı bilgileri',
    required: false,
    example: {
      userId: '770e8400-e29b-41d4-a716-446655440002',
      username: 'johndoe',
      email: 'john@example.com',
    },
  })
  user?: {
    userId: string;
    username: string;
    email?: string;
  };

  @Expose()
  @ApiProperty({
    description: 'İncelenen asset bilgileri',
    required: false,
    example: {
      id: '660e8400-e29b-41d4-a716-446655440001',
      title: 'Hilton İstanbul Bomonti',
      brand: 'Hilton',
      model: 'Luxury Hotel',
    },
  })
  asset?: {
    id: string;
    title: string;
    brand?: string;
    model?: string;
  };

  @Expose()
  @ApiProperty({
    description: 'İncelemeye eklenen medya dosyaları (fotoğraf/video)',
    required: false,
    example: [
      {
        id: '880e8400-e29b-41d4-a716-446655440003',
        url: 'https://cdn.example.com/reviews/photo1.jpg',
        mediaType: 'image',
        createdAt: '2024-01-15T10:30:00.000Z',
      },
    ],
  })
  media?: Array<{
    id: string;
    url: string;
    mediaType: string;
    createdAt: Date;
  }>;

  @Expose()
  @ApiProperty({
    description: 'İncelemeye yapılan yorumlar',
    required: false,
    example: [
      {
        id: '990e8400-e29b-41d4-a716-446655440004',
        content: 'Çok doğru söylemişsiniz!',
        createdAt: '2024-01-16T12:00:00.000Z',
        user: {
          userId: 'aa0e8400-e29b-41d4-a716-446655440005',
          username: 'janedoe',
        },
      },
    ],
  })
  comments?: Array<{
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      userId: string;
      username: string;
    };
  }>;

  constructor(partial: Partial<ReviewResponseDto>) {
    Object.assign(this, partial);
  }
}

import { IsString, IsNotEmpty, IsIn, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewMediaCreateDto {
  @ApiProperty({
    description: 'Medya dosyasının URL yolu (Örn: CDN veya S3)',
    example: 'https://cdn.example.com/reviews/photo1.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Medya tipi',
    example: 'image',
    enum: ['image', 'video'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['image', 'video'])
  mediaType: string;
}

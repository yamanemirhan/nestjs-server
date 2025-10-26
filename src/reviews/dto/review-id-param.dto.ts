import { IsUUID } from 'class-validator';

export class ReviewIdParamDto {
  @IsUUID(4, { message: 'reviewId geçerli bir UUID formatında olmalıdır.' })
  reviewId: string;
}

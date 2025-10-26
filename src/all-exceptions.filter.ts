import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MyLoggerService } from './my-logger/my-logger.service';
import { Response, Request } from 'express';
import { Result } from './common/base-response.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

interface ErrorMessage {
  message: string;
  field?: string;
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const resultObject: Result<never> = {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errors: [{ message: 'Bir hata oluştu' }],
    };

    if (exception instanceof HttpException) {
      resultObject.statusCode = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const responseMessage = (exceptionResponse as any).message;

        // Eğer message bir array ise (validation errors)
        if (Array.isArray(responseMessage)) {
          resultObject.errors = responseMessage.map((msg) => ({
            message: msg,
          }));
        }
        // Eğer message bir string ise
        else if (typeof responseMessage === 'string') {
          resultObject.errors = [{ message: responseMessage }];
        }
        // Diğer durumlar için exception message kullan
        else {
          resultObject.errors = [{ message: exception.message }];
        }
      } else if (typeof exceptionResponse === 'string') {
        resultObject.errors = [{ message: exceptionResponse }];
      } else {
        resultObject.errors = [{ message: exception.message }];
      }
    } else if (exception instanceof PrismaClientValidationError) {
      resultObject.statusCode = 422;
      resultObject.errors = [
        { message: 'Veritabanı validasyon hatası' },
        { message: this.cleanPrismaError(exception.message) },
      ];
    } else if (exception instanceof PrismaClientKnownRequestError) {
      resultObject.statusCode = 400;
      const prismaError = this.handlePrismaError(exception);
      resultObject.statusCode = prismaError.statusCode;
      resultObject.errors = prismaError.errors;
    } else if (exception instanceof Error) {
      if (
        exception.message.includes('Error creating UUID') ||
        exception.message.includes('invalid length') ||
        exception.message.includes('Invalid UUID')
      ) {
        resultObject.statusCode = 400;
        resultObject.errors = [{ message: 'Geçersiz ID formatı.' }];
      } else {
        resultObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        resultObject.errors = [{ message: exception.message }];
      }
    } else {
      resultObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      resultObject.errors = [{ message: 'Bilinmeyen bir hata oluştu' }];
    }

    response.status(resultObject.statusCode).json(resultObject);

    this.logger.error(
      JSON.stringify(resultObject),
      exception instanceof Error ? exception.stack : '',
      AllExceptionsFilter.name,
    );

    super.catch(exception, host);
  }

  /**
   * Prisma hatalarını kullanıcı dostu mesajlara çevirir
   */
  private handlePrismaError(exception: PrismaClientKnownRequestError): {
    statusCode: number;
    errors: ErrorMessage[];
  } {
    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        const target = (exception.meta?.target as string[]) || [];
        return {
          statusCode: 409,
          errors: [
            {
              message: `Bu ${target.join(', ')} zaten kullanılıyor.`,
              field: target[0],
            },
          ],
        };

      case 'P2003': // Foreign key constraint failed
        return {
          statusCode: 400,
          errors: [{ message: 'İlişkili kayıt bulunamadı.' }],
        };

      case 'P2025': // Record not found
        return {
          statusCode: 404,
          errors: [{ message: 'Kayıt bulunamadı.' }],
        };

      case 'P2014': // Invalid ID
        return {
          statusCode: 400,
          errors: [{ message: 'Geçersiz ID formatı.' }],
        };

      case 'P2011': // Null constraint violation
        const fieldName = exception.meta?.target || 'Alan';
        return {
          statusCode: 400,
          errors: [{ message: `${fieldName} boş bırakılamaz.` }],
        };

      default:
        return {
          statusCode: 400,
          errors: [
            {
              message: 'Veritabanı hatası oluştu.',
            },
            {
              message: exception.message,
            },
          ],
        };
    }
  }

  private cleanPrismaError(message: string): string {
    const lines = message.split('\n');
    const relevantLines = lines.filter(
      (line) =>
        line.trim() &&
        !line.includes('prisma') &&
        !line.includes('Validation') &&
        !line.includes('at '),
    );
    return relevantLines.join(' ').trim() || message;
  }
}

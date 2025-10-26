import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './auth/auth.guard';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ReviewsModule } from './reviews/reviews.module';
import { CategoriesModule } from './categories/categories.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MyLoggerModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 3000,
        limit: 2,
      },
      {
        name: 'long-term',
        ttl: 60000,
        limit: 100,
      },
    ]),
    MyLoggerModule,
    AuthModule,
    UsersModule,
    ReviewsModule,
    CategoriesModule,
    AssetsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

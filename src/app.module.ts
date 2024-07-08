import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ControllersModule } from './controllers/controllers.module';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `${process.env.DB_HOST}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}`,
      {
        dbName:
          process.env.ENVIRONMENT === 'production'
            ? process.env.DB_NAME
            : process.env.DB_NAME_TEST,
      },
    ),
    ControllersModule,
    UserModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}

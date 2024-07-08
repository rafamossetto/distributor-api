import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { version, name } from '../package.json';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user/user.schema';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const userModel = app.get(getModelToken(User.name));

  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done) => {
    try {
      Logger.log('Serializando usuario:', user);
      done(null, user._doc._id);
    } catch (error) {
      Logger.error('Error al serializar usuario:', error);
      done(error);
    }
  });

  passport.deserializeUser(async (id: string, done) => {
    Logger.log('Deserializando usuario con ID:', id);
    try {
      const user = await userModel.findById(id).exec();
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      Logger.log('Usuario encontrado:', user);
      done(null, user);
    } catch (error) {
      Logger.error('Error al deserializar usuario:', error);
      done(error);
    }
  });

  const options = new DocumentBuilder()
    .setTitle('distributor-api')
    .setDescription('Document for understand the endpoints')
    .setVersion('1.0')
    .addTag('Endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT);
  Logger.verbose(`[${name}] Welcome! ready on port: ${PORT} | v${version}`);
}
bootstrap();

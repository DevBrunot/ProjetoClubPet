import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Define a pasta de assets estáticos (por exemplo, imagens, CSS, etc.)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Define a pasta onde ficarão as views (templates)
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  
  // Define o EJS como template engine
  app.setViewEngine('ejs');

  // Habilita CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

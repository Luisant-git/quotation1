import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config(); 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config=new DocumentBuilder()
  .setTitle('Quotation')
  .setDescription('The Quotation API description')
  .setVersion('1.0')
  .addTag('Quotation')
  .addBearerAuth()
  .build();

const document=SwaggerModule.createDocument(app,config);
SwaggerModule.setup('api', app, document);

app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');  
  next();
});


app.enableCors({
  origin: '*',
  credentials: true,
});

  await app.listen(3999);
}
bootstrap();

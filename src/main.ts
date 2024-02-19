import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('main');

  
  app.setGlobalPrefix('api');
  app.useGlobalPipes( 
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    // transform: true,  // transform payload to DTO object
    // transformOptions: {
    //   enableImplicitConversion: true, // convert string to number
    // },
    })
   );

   const config = new DocumentBuilder()
    .setTitle('Products Api')
    .setDescription('The products API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
   await app.listen(process.env.PORT || 3001); 
   logger.log(`Application is running on: ${process.env.PORT || 3001}`);
}
bootstrap();

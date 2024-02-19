<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

Rest API para el manejo de productos, con autenticacion y proteccion de rutas, manejo de archivos locales en [NestJS](https://github.com/nestjs/nest).

## Tecnologias utilizadas
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Swagger](https://swagger.io/)
- [Socket.io](https://socket.io/)
- [Passport](http://www.passportjs.org/)
- [JWT](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Class-validator]( https://www.npmjs.com/package/class-validator)
- [Class-transformer](https://www.npmjs.com/package/class-transformer)
- [uuid](https://www.npmjs.com/package/uuid)
- [Serve-static](https://www.npmjs.com/package/serve-static)


## Teslo API
1. Instalar dependencias
```bash
npm install
```
2. Crear archivo .env
```bash
cp .env.example .env
```
3. Levantar la base de datos
```bash
docker-compose up -d
```
4. Ejecutar el seed
```bash
http://localhost:3000/api/seed
```
5. Correr el proyecto
```bash
npm run start:dev
```

import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeaders } from './decorators/get-rawHeaders.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user:User
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testPrivateRoute(
    @Req() req: Express.Request,
    @GetUser() user:User,
    //@GetUser(['email','roles','fullName']) user:User,
    @GetUser(['email']) emailUser:string,
    @GetRawHeaders() rawHeaders:string[],
    @GetRawHeaders() headers:IncomingHttpHeaders
  ){
    console.log("🚀 ~ AuthController ~ req:", req)
    console.log("🚀 ~ AuthController ~ user:", user)
    console.log("🚀 ~ AuthController ~ emailUser:", emailUser)
    console.log("🚀 ~ AuthController ~ headers:", headers)
    
    return {message: 'test'};
  }


  
  @Get('private2')
  //@SetMetadata('roles', ['admin','super-user'])
  @RoleProtected( ValidRoles.admin, ValidRoles.superUser)
  @UseGuards( AuthGuard(), UserRoleGuard )
  testPrivateRoute2(
    @GetUser() user:User,
  ){
    console.log("🚀 ~ AuthController ~ user:", user)
    
    return {message: 'test2'};
  }


  
  @Get('private3')
  @Auth( ValidRoles.admin, ValidRoles.superUser)
  testPrivateRoute3(
    @GetUser() user:User,
  ){
    console.log("🚀 ~ AuthController ~ user:", user)
    
    return {message: 'test2'};
  }
}

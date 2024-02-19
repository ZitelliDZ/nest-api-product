import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      
      const { isActive, password, ...res} = await this.userRepository.save({...user, password: bcrypt.hashSync(user.password, 10)});

      
      return {...res, token: this.getJwtToken({id:user.id,fullName:user.fullName,email:res.email,roles:res.roles})};
      
    } catch (error) {
      this.handleException(error, 'Error creating user');
      
    }
    

  }

  async checkAuthStatus(user:User) {

    return {...user, token: this.getJwtToken({id:user.id,fullName:user.fullName,email:user.email,roles:user.roles})};
  }


  async login(loginUserDto: LoginUserDto) {
    try {
      const {email,password} = loginUserDto
      const user = await this.userRepository.findOne({
        where: { email },
        select: {email:true, password:true, roles:true,fullName:true, id:true}
      });


      if (user && bcrypt.compareSync(loginUserDto.password, user.password)) {
        delete user.password;
        return {...user, token: this.getJwtToken({id:user.id,fullName:user.fullName,  email:user.email,roles:user.roles})};
      }
      
      
    } catch (error) {
      this.handleException(error, 'Error logging in');
       
    }
    throw new BadRequestException('Invalid credentials');

  }

  
  private handleException(error: any, message: string):never {
    
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(`Error creating user: ${error.message}`);
    console.log("🚀 ~ AuthService ~ handleException ~ error:", error)
    throw new InternalServerErrorException(`${message} - check logs for more details`);
    
  }


  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);
    return token
  }

}

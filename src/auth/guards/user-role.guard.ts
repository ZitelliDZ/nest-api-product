import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) {}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    //const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const roles = this.reflector.get<string[]>(META_ROLES, context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new BadRequestException('User not authenticated');
    }

    const hasRole = () => user.roles.some((role) => roles.includes(role));
    
    if(hasRole() === false){
      throw new ForbiddenException('Unauthorized access');
    }    
    return true;
  }
}

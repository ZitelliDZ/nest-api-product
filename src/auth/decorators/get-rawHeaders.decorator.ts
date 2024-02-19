import { ExecutionContext, InternalServerErrorException, createParamDecorator } from '@nestjs/common';

export const GetRawHeaders = createParamDecorator((data, ctx: ExecutionContext) => {
    
        const request = ctx.switchToHttp().getRequest();
        const rawHeaders = request.rawHeaders;

        if(!rawHeaders) throw new InternalServerErrorException('Raw headers not found');

        if(data){
            return rawHeaders[data];
        }

        return rawHeaders;
});

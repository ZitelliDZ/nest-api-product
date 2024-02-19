import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";



export class PaginationDto {

    @ApiProperty({
        example: 10,
        description: 'Cantidad de registros a mostrar por página',
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        example: 0,
        description: 'Cantidad de registros a saltar',
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    offset?: number;
}
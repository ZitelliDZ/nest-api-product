import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        example: 'Camiseta de algodon',
        description: 'Nombre del producto',
        minLength: 3,
    })
    @IsString()
    @MinLength(3)
    title: string;

    @ApiProperty({
        example: 'Camiseta de algodon para hombre',
        description: 'Descripción del producto',
        minLength: 3,
    })
    @IsString()
    @MinLength(3)
    @IsOptional()
    description?: string;
    
    @ApiProperty({
        example: 100.5,
        description: 'Precio del producto',
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        example: 11,
        description: 'Stock del producto',
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        example: 'camiseta_de_algodon',
        description: 'Slug del producto',
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: ['S','M','L','XL'],
        description: 'Tallas disponibles del producto',
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        example: ['camisetas','ropa'],
        description: 'Categorias del producto',
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];
    
    @ApiProperty({
        example: 'hombre',
        description: 'Genero del producto',
    })
    @IsIn(['men','women','kids','unisex' ])
    @MinLength(3)
    gender: string;

    @ApiProperty({
        example: ['https://example.com/image1.jpg','image2.jpg'],
        description: 'Imagenes del producto',
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

}

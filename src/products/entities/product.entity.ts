import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-images.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products'})
export class Product {

  @ApiProperty({
    example: '2da7a6a2-129f-46f2-95e7-744332d94ed6',
    uniqueItems: true,
    description: 'Identificador único del producto'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Camiseta de algodon',
    uniqueItems: true,
    description: 'Nombre del producto'
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 'Camiseta de algodon para hombre',
    default: null,
    description: 'Descripción del producto'
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 100.5,
    default: 0,
    description: 'Precio del producto'
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 11,
    default: 0,
    description: 'Stock del producto'
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: 'camiseta_de_algodon',
    uniqueItems: true,
    description: 'Slug del producto'
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: ['S','M','L','XL'],
    description: 'Tallas disponibles del producto'
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'hombre',
    description: 'Genero del producto'
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['camisetas','ropa'],
    description: 'Categorias del producto'
  })
  @Column('text', { array: true, default: []})
  tags: string[];

  @ApiProperty({
    example: ['https://www.google.com','324257295.png'],
    description: 'Enlace a la tienda'
  })
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    {
      cascade: true,
      eager: true
    }
  )
  images?: ProductImage[];

  @ApiProperty()
  @ManyToOne(
    () => User,
    (user) => user.products,
    {
      eager: true
    }
  )
  user: User


  @BeforeInsert()
  generateSlug() {

    if (!this.slug) {
      this.slug = this.title
    }

    this.slug = this.slug.toLowerCase()
      .replaceAll(' ','_')
      .replaceAll("'","")
      .replaceAll('ñ','n');
  }

  @BeforeUpdate()
  generateSlugOnUpdate() {
    
    this.slug = this.slug.toLowerCase()
      .replaceAll(' ','_')
      .replaceAll("'","")
      .replaceAll('ñ','n');
  }
}

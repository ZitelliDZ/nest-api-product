import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {validate as IsUUID} from 'uuid'
import { ProductImage } from './entities/product-images.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
    
    private readonly dataSource:DataSource
  ) {}

  async create(user:User,createProductDto: CreateProductDto) {
    try {

      const {images=[], ...productDetails} = createProductDto
      
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImagesRepository.create({url:image})),
        user:user 
      });
      await this.productRepository.save(product);
      return {...product, images};
    } catch (error) {
      this.handleException(error, 'Error creating product');
    }
  }

  async findAll( paginationDto: PaginationDto) {
    try {
      const { limit, offset } = paginationDto;
      const [products, total] = await this.productRepository.findAndCount({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });
      return {
        data: products.map( product => ({...product, images: product.images.map( image => image.url)})),
        limit,
        offset,
        total
      };   
    } catch (error) {
      this.handleException(error, 'Error fetching products');      
    }
  }

  async findOne(term: string) {
    let product : Product;
    
    try {
      
    if (IsUUID(term)) {
      product = await this.productRepository.findOneBy({id:term});
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('UPPER(title) ILIKE :title', { title: `%${term.toLocaleUpperCase()}%` })
        .orWhere('slug ILIKE :slug', { slug: `%${term.toLocaleLowerCase()}%` })
        .leftJoinAndSelect('product.images', 'images')
        .getOne();
    }
      
    } catch (error) {
      this.handleException(error, 'Error fetching product');      
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto,user:User) {

    let product:Product
    const {images, ...restProductDetails} = updateProductDto
    try {

      product = await  this.productRepository.preload({
        id: id,
        ...restProductDetails
      });
    } catch (error) {
      this.handleException(error, 'Error updating product');
    }

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images){
        await queryRunner.manager.delete(ProductImage, {product: product.id});
        product.images = images.map( image => this.productImagesRepository.create({url:image}))
      }else{
       // product.images = await this.productImagesRepository.findBy({product: product.id});
      }
      // Add new images
      product.user = user;
      await queryRunner.manager.save(product);

      // Commit transaction
      await queryRunner.commitTransaction();
    

      return this.findOnePlain(product.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleException(error, 'Error updating product');
    } finally {
      await queryRunner.release();
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);


    await this.productRepository.remove(product);
    return {...product,images: product.images.map( image => image.url)};
  }


  private handleException(error: any, message: string) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(`Error creating product: ${error.message}`);
    throw new InternalServerErrorException(`${message} - check logs for more details`);
  }


  async findOnePlain(term: string) {
    const product = await this.findOne(term);

    return {
      ...product,
      images: product.images.map( image => image.url)
    }
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleException(error, 'Error deleting products');
      
    }
  }
}

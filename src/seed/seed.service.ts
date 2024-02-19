import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data-product';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.inserUsers();
    const user = await this.userRepository.findOne({where:{email:adminUser.email}})
    await this.insertAllProducts(user);

    return `This action returns all seed`;
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async inserUsers() {
    const users = initialData.users;

    const insertPromises = [];

    users.forEach(user => {
      insertPromises.push(this.userRepository.save(user));
    });

    await Promise.all(insertPromises);
    return users[0]
  }

  private async insertAllProducts(adminUser:User) {

    const products = initialData.products;

    const insertPromises = [];

     products.forEach(product => {
       insertPromises.push(this.productsService.create(adminUser,product))
     })

    await Promise.all(insertPromises);

    return true;
  }
}

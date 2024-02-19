import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    
    @Column('text', { unique: true })
    email: string;
    
    @Column('text',{
        select: false
    })
    password: string;

    
    @Column('text')
    fullName: string;
    
    @Column('text', { array: true , default: ['user']})
    roles: string[];
    
    @Column('boolean', { default: true })
    isActive: boolean;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }
    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

    @OneToMany(
        () => Product,
        (product) => product.user,
        {
            cascade: true
        }
    )
    products?: Product[];

}

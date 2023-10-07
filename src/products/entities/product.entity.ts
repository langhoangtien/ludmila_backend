import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileEntity } from '../../files/entities/file.entity';
import { EntityHelper } from 'src/utils/entity-helper';
import { Category } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Product extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true })
  name: string;

  @Column({ type: String, unique: true })
  slug: string;

  @Column({ nullable: true })
  introduction: string;

  @Column({ nullable: true, type: 'text' })
  @Expose({ groups: ['findOne'] })
  description: string;

  @Column({ nullable: true, default: 0 })
  price: number;

  @Column({ nullable: true, default: 0 })
  priceSale: number;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  barCode: string;

  @ManyToOne(() => FileEntity, { eager: true })
  photo?: FileEntity | null;

  @ManyToMany(() => FileEntity)
  @JoinTable()
  photos: FileEntity[];

  @ManyToOne(() => Category, {
    eager: true,
  })
  category: Category;

  @ManyToOne(() => Brand, {
    eager: true,
  })
  brand: Brand;

  @ManyToOne(() => Country, {
    eager: true,
  })
  country: Country;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

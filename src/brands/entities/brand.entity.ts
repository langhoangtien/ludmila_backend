import { IsOptional } from 'class-validator';
import { FileEntity } from 'src/files/entities/file.entity';
import { Product } from 'src/products/entities/product.entity';
import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Brand extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true })
  name: string;

  @Column({ type: String, unique: true })
  slug: string;

  @Column({ type: String, nullable: false })
  @IsOptional()
  address?: string;

  @Column({ type: String })
  phone: string;

  @Column({ type: String })
  site: string;

  @Column({ type: String })
  mail: string;

  @Column({ type: String })
  fax: string;

  @Column({ nullable: true, type: String })
  description: string;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

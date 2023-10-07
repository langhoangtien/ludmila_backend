import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Brackets, DeepPartial, ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productsRepository.save(
      this.productsRepository.create(createProductDto),
    );
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    search: string,
    filter: string[],
    {
      brand,
      country,
      category,
    }: { brand: string; country: number; category: number },
  ): Promise<[Product[], number]> {
    const where = filter.map((property) => ({
      [property]: ILike(`%${search}%`),
    }));
    // if (brand) where.push({ brand: { id: brand } });
    // if (country) where.push({ country: { id: country } });
    // if (category) where.push({ category: { idcategory } });
    return this.productsRepository.findAndCount({
      where: where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findMany({
    page = 1,
    perPage = 10,
    search = '',
    brand,
    country,
    category,
    order,
    orderBy = 'createdAt',
  }): Promise<[Product[], number]> {
    // const query = await this.userRepository.createQueryBuilder('user')
    //         .leftJoinAndSelect('user.posts', 'posts')
    //         .leftJoinAndSelect('user.comments', 'comments')
    //         .where(new Brackets(qb =>
    //             qb.where('user.age > :minAge', { minAge: 18 })
    //               .andWhere('user.age < :maxAge', { maxAge: 35 }))
    //         .orWhere(new Brackets(qb =>
    //             qb.where('user.age > :minAge', { minAge: 50 })
    //               .andWhere('user.age < :maxAge', { maxAge: 65 }))
    //         .limit(10)
    //         .getMany();

    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.photo', 'photo')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.country', 'country')
      .where(
        new Brackets((qb) =>
          qb
            .where({ name: ILike(`%${search}%`) })
            .orWhere({ slug: ILike(`%${search}%`) }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .andWhere(brand ? 'product.brand = :brand' : '1=1', {
              brand: +brand,
            })
            .andWhere(country ? 'product.country = :country' : '1=1', {
              country: +country,
            })
            .andWhere(category ? 'product.category = :category' : '1=1', {
              category: +category,
            }),
        ),
      )
      .skip(page * perPage - perPage)
      .take(perPage)
      .orderBy(`product.${orderBy}`, order)
      .getManyAndCount();
  }

  //   where: { category: { slug: 'thuc-pham-chuc-nang' } },
  findAll(params): Promise<Product[]> {
    return this.productsRepository.find(params);
  }

  findOne(fields: EntityCondition<Product>): Promise<NullableType<Product>> {
    return this.productsRepository.findOne({
      where: fields,
      relations: {
        photos: true,
        brand: true,
        country: true,
      },
    });
  }

  findById() {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.photo', 'photo')
      .select(['product.name', 'product.id', 'photo.path AS path'])
      .getMany();
  }

  update(id: number, payload: DeepPartial<Product>): Promise<Product> {
    return this.productsRepository.save(
      this.productsRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.productsRepository.softDelete(id);
  }
}

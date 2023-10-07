import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DeepPartial, ILike, Repository } from 'typeorm';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.save(
      this.categoriesRepository.create(createCategoryDto),
    );
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    search: string,
    filter: string[],
  ): Promise<[Category[], number]> {
    return this.categoriesRepository.findAndCount({
      where: filter.map((property) => ({ [property]: ILike(`%${search}%`) })),
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findAll() {
    return this.categoriesRepository.find({
      relations: { products: true },
      skip: 0,
      take: 10,
    });
  }

  findOne(fields: EntityCondition<Category>): Promise<NullableType<Category>> {
    return this.categoriesRepository.findOne({
      where: fields,
    });
  }
  update(id: number, payload: DeepPartial<Category>): Promise<Category> {
    return this.categoriesRepository.save(
      this.categoriesRepository.create({ id, ...payload }),
    );
  }

  remove(id: number) {
    return this.categoriesRepository.delete(id);
  }

  async softDelete(ids: string | number | string[] | number[]): Promise<void> {
    await this.categoriesRepository.softDelete(ids);
  }
}

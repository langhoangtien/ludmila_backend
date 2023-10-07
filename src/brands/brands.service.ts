import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { DeepPartial, ILike, Like, Repository } from 'typeorm';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}
  create(createBrandDto: CreateBrandDto) {
    return this.brandRepository.save(
      this.brandRepository.create(createBrandDto),
    );
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    search: string,
    filter: string[],
  ): Promise<[Brand[], number]> {
    return this.brandRepository.findAndCount({
      where: filter.map((property) => ({ [property]: ILike(`%${search}%`) })),
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findAll() {
    return this.brandRepository.find({
      relations: { products: true },
      skip: 0,
      take: 10,
    });
  }

  findOne(fields: EntityCondition<Brand>): Promise<NullableType<Brand>> {
    return this.brandRepository.findOne({
      where: fields,
    });
  }
  update(id: number, payload: DeepPartial<Brand>): Promise<Brand> {
    return this.brandRepository.save(
      this.brandRepository.create({ id, ...payload }),
    );
  }

  remove(id: number) {
    return this.brandRepository.delete(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.brandRepository.softDelete(id);
  }
}

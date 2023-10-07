import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { DeepPartial, ILike, Repository } from 'typeorm';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}
  create(createCountryDto: CreateCountryDto) {
    return this.countryRepository.save(
      this.countryRepository.create(createCountryDto),
    );
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    search: string,
    filter: string[],
  ): Promise<[Country[], number]> {
    return this.countryRepository.findAndCount({
      where: filter.map((property) => ({ [property]: ILike(`%${search}%`) })),
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findAll() {
    return this.countryRepository.find({
      relations: { products: true },
      skip: 0,
      take: 10,
    });
  }

  findOne(fields: EntityCondition<Country>): Promise<NullableType<Country>> {
    return this.countryRepository.findOne({
      where: fields,
    });
  }
  update(id: number, payload: DeepPartial<Country>): Promise<Country> {
    return this.countryRepository.save(
      this.countryRepository.create({ id, ...payload }),
    );
  }

  remove(id: number) {
    return this.countryRepository.delete(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.countryRepository.softDelete(id);
  }
}

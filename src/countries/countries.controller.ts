import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  SerializeOptions,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Country } from './entities/Country.entity';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { NullableType } from 'src/utils/types/nullable.type';

@ApiBearerAuth()
@ApiTags('Countries')
@Controller({ path: 'countries', version: '1' })
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('home')
  @HttpCode(HttpStatus.OK)
  home(): Promise<Country[]> {
    return this.countriesService.findAll();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
    return this.countriesService.create(createCountryDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('filter', new DefaultValuePipe('[]')) filter: string,
  ): Promise<InfinityPaginationResultType<Country>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.countriesService.findManyWithPagination(
        {
          page,
          limit,
        },
        search,
        JSON.parse(filter),
      ),
      { page, limit },
    );
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Country>> {
    return this.countriesService.findOne({ id: +id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    return this.countriesService.update(+id, { ...updateCountryDto, id: +id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.countriesService.softDelete(+id);
  }
}

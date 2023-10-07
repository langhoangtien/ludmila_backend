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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Brand } from './entities/brand.entity';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { NullableType } from 'src/utils/types/nullable.type';

@ApiBearerAuth()
@ApiTags('Brands')
@Controller({ path: 'brands', version: '1' })
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get('home')
  @HttpCode(HttpStatus.OK)
  home(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto);
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
  ): Promise<InfinityPaginationResultType<Brand>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.brandsService.findManyWithPagination(
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
  findOne(@Param('id') id: string): Promise<NullableType<Brand>> {
    return this.brandsService.findOne({ id: +id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.brandsService.softDelete(+id);
  }
}

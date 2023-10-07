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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { NullableType } from 'src/utils/types/nullable.type';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('home')
  @HttpCode(HttpStatus.OK)
  home(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
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
  ): Promise<InfinityPaginationResultType<Category>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.categoriesService.findManyWithPagination(
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
  findOne(@Param('id') id: string): Promise<NullableType<Category>> {
    return this.categoriesService.findOne({ id: +id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMany(@Body() ids: number[] | string[]): Promise<void> {
    return this.categoriesService.softDelete(ids);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.softDelete(+id);
  }
}

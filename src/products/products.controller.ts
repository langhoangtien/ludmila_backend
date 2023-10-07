import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from 'src/roles/roles.guard';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { Product } from './entities/product.entity';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@ApiTags('Products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesSevice: CategoriesService,
  ) {}

  //ADD  PRODUCT
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
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
    @Query('country', new DefaultValuePipe('')) country: string,
    @Query('category', new DefaultValuePipe('')) category: string,
    @Query('brand', new DefaultValuePipe('')) brand: string,
  ): Promise<InfinityPaginationResultType<Product>> {
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.productsService.findManyWithPagination(
        {
          page,
          limit,
        },
        search,
        JSON.parse(filter),
        { brand: brand, category: +category, country: +country },
      ),
      { page, limit },
    );
  }

  @Get('a')
  @HttpCode(HttpStatus.OK)
  getAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('filter', new DefaultValuePipe('[]')) filter: string,
    @Query('brand', new DefaultValuePipe('')) brand: string,
    @Query('country', new DefaultValuePipe('')) country: string,
    @Query('category', new DefaultValuePipe('')) category: string,
    @Query('orderBy', new DefaultValuePipe('createdAt'))
    orderBy: string,
    @Query('order', new DefaultValuePipe('DESC'))
    order: 'ASC' | 'DESC' | undefined,
  ): Promise<[Product[], number]> {
    return this.productsService.findMany({
      page,
      perPage,
      search,
      brand,
      country,
      category,
      orderBy,
      order,
    });
  }

  @Get('home')
  async getHomeData(): Promise<any> {
    const categories = await this.categoriesSevice.findAll();
    const products = await Promise.all(
      categories.map(
        async (category) =>
          await this.productsService.findAll({
            skip: 0,
            take: 10,
            where: { category: { id: category.id } },
          }),
      ),
    );
    const data = categories.map((category, index) => ({
      ...category,
      products: products[index],
    }));
    return data;
  }

  @SerializeOptions({
    groups: ['findOne'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Product>> {
    return this.productsService.findOne({ id: +id });
  }

  @SerializeOptions({
    groups: ['admin', 'findOne'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.softDelete(id);
  }
}

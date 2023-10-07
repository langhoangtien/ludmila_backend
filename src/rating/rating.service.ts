import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}
  create(createRatingDto: CreateRatingDto) {
    return this.ratingsRepository.save(
      this.ratingsRepository.create(createRatingDto),
    );
  }

  findAll() {
    return `This action returns all rating`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rating`;
  }

  update(id: number, payload: DeepPartial<Rating>): Promise<Rating> {
    return this.ratingsRepository.save(
      this.ratingsRepository.create({ id, ...payload }),
    );
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }
}

import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateDogDto, ListAllEntities, UpdateDogDto } from './dogs.interface'
import { DogsService } from './dogs.service'
import test from '../test'

@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Post()
  create(@Body() crateDogDto: CreateDogDto) {
    this.dogsService.create(crateDogDto)
    // return 'This actuon adds a new dog' + crateDogDto.name;
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    console.log(test.get())
    return this.dogsService.findAll(query)
    // return `This action returns all dogs (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} dog`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDogDto: UpdateDogDto) {
    return `This action updates a #${id} dog, name is ${updateDogDto.name}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} dog`;
  }
}

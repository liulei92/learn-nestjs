/*
 * @Description: 
 * @Date: 2020-08-05 17:46:10
 * @Author: LeiLiu
 */
import { Injectable } from '@nestjs/common';
import { CreateDogDto, UpdateDogDto, ListAllEntities } from './dogs.interface'
import { UtilsService } from '../common/utils/utils.service'

@Injectable()
export class DogsService {
  constructor(private readonly utilsService: UtilsService) {}
  private readonly dogs: Array<UpdateDogDto> = [];

  create(dog: CreateDogDto): void {
    const max = this.utilsService.getMaxKey(this.dogs, 'id')
    this.dogs.push({ ...dog, id: (max + 1).toString() });
  }

  update(dog: UpdateDogDto): void {
    this.dogs.forEach((item, i) => {
      if (dog.id === item.id) {
        this.dogs[i] = dog;
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findAll(query: ListAllEntities): UpdateDogDto[] {
    return this.dogs;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shareText(text?: string): UpdateDogDto[] {
    // return 'share text' + text
    return this.dogs;
  }
}

// const DDogsService = new DogsService()
// export default DDogsService

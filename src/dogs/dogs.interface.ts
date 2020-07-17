export class CreateDogDto {
  readonly name: string;
  readonly age?: number;
  readonly breed?: string;
}

export class ListAllEntities {
  page: number;
  limit: number;
  name?: string;
  age?: number;
}

export class UpdateDogDto {
  id: string;
  name: string;
  age?: number;
  breed?: string;
}
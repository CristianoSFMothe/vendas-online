import { AddressEntity } from '../entities/address.entity';

export const addressMock: AddressEntity = {
  id: 1,
  complement: 'Apto 101',
  street: 'Rua Exemplo',
  neighborhood: 'Centro',
  numberAddress: 500,
  cep: '26298195',
  cityId: 3640,
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from '../city.service';
import { Repository } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { CacheService } from '../../../cache/cache.service';
import { cityMock } from '../__mocks__/city.mock';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([cityMock]),
          },
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cityMock),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined();
  });

  describe('findCityById', () => {
    it('should return findOne City', async () => {
      const city = await service.findCityById(cityMock.id);

      expect(city).toEqual(cityMock);
    });
  });

  describe('findOne', () => {
    it('should return error findOne not found', async () => {
      jest.spyOn(cityRepository, 'findOne').mockResolvedValue(undefined);

      expect(service.findCityById(cityMock.id)).rejects.toThrowError();
    });
  });

  describe('getAllCitiesByStateId', () => {
    it('should return Cities in getAllCitiesByStateId', async () => {
      const city = await service.getAllCitiesByStateId(cityMock.id);

      expect(city).toEqual([cityMock]);
    });
  });
});

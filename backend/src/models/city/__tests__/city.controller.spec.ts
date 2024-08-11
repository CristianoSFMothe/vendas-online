import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from '../city.controller';
import { CityService } from '../city.service';
import { cityMock } from '../__mocks__/city.mock';
import { stateMock } from '../../../models/state/__mocks__/state.mock';

describe('CityController', () => {
  let controller: CityController;
  let service: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        {
          provide: CityService,
          useValue: {
            getAllCitiesByStateId: jest.fn().mockResolvedValue([cityMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<CityController>(CityController);
    service = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCitiesByStateId', () => {
    it('should return an array of cities for a given state ID', async () => {
      const stateId = stateMock.id; // Use o ID do mock de estado
      const result = await controller.getAllCitiesByStateId(stateId);
      expect(result).toEqual([cityMock]);
      expect(service.getAllCitiesByStateId).toHaveBeenCalledWith(stateId);
    });
  });
});

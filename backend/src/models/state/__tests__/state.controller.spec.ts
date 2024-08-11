import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from '../state.controller';
import { StateService } from '../state.service';
import { stateMock } from '../__mocks__/state.mock';

describe('StateController', () => {
  let stateController: StateController;
  let stateService: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        {
          provide: StateService,
          useValue: {
            getAllState: jest.fn().mockResolvedValue([stateMock]),
          },
        },
      ],
    }).compile();

    stateController = module.get<StateController>(StateController);
    stateService = module.get<StateService>(StateService);
  });

  describe('getAllState', () => {
    it('should return an array of states', async () => {
      const result = await stateController.getAllState();
      expect(result).toEqual([stateMock]);
      expect(stateService.getAllState).toHaveBeenCalled();
    });
  });
});

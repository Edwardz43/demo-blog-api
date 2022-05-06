import { Test, TestingModule } from '@nestjs/testing';
import { UtilService } from './util.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilService],
    }).compile();

    service = module.get<UtilService>(UtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return the same result', async () => {
    const password = 'test';
    const hash = await service.encryptPassword(password).then((res) => res);
    const result = await service
      .comparePassword(password, hash)
      .then((res) => res);
    expect(result).toBe(true);
  });
});

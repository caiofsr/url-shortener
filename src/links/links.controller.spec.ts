import { TestBed } from '@automock/jest';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';

describe('LinksController', () => {
  let controller: LinksController;
  let linksService: jest.Mocked<LinksService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(LinksController).compile();

    controller = unit;
    linksService = unitRef.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should shorten link without user', async () => {
    linksService.createLink = jest.fn().mockImplementation(() => {
      return {
        id: 1,
        url: 'https://testing.com',
        slug: 'testing',
      };
    });

    const link = await controller.shorten({ url: 'https://testing.com' });
    expect(link).toEqual({
      id: 1,
      url: 'https://testing.com',
      slug: 'testing',
    });
  });

  it('should shorten link with user', async () => {
    linksService.createLink = jest.fn().mockImplementation(() => {
      return {
        id: 1,
        url: 'https://testing.com',
        slug: 'testing',
        user: {
          id: 1,
          email: 'testing@example.com',
        },
      };
    });

    const link = await controller.shorten({
      url: 'https://testing.com',
    });
    expect(link).toEqual({
      id: 1,
      url: 'https://testing.com',
      slug: 'testing',
      user: {
        id: 1,
        email: 'testing@example.com',
      },
    });
  });
});

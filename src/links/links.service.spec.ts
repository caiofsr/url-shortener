import { TestBed } from '@automock/jest';
import { LinksService } from './links.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('LinksService', () => {
  let service: LinksService;
  let prismaService: jest.Mocked<PrismaService>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(LinksService).compile();

    service = unit;
    prismaService = unitRef.get<PrismaService>(PrismaService);
    usersService = unitRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create link without user', async () => {
    prismaService.link.create = jest.fn().mockImplementation(() => {
      return {
        id: 1,
        url: 'https://testing.com',
        slug: 'testing',
      };
    });

    const link = await service.createLink({
      url: 'https://testing.com',
    });

    expect(link).toEqual({
      id: 1,
      url: 'https://testing.com',
      slug: 'testing',
    });
  });

  it('should create link with user', async () => {
    prismaService.link.create = jest.fn().mockImplementation(() => {
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

    usersService.getUser = jest.fn().mockImplementation(() => {
      return {
        id: 1,
      };
    });

    const link = await service.createLink({
      url: 'https://testing.com',
      user: {
        userId: 1,
        email: 'testing@example.com',
      },
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

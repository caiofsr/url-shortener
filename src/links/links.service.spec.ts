import { TestBed } from '@automock/jest';
import { PrismaService } from 'nestjs-prisma';
import { LinksService } from './links.service';
import { UsersService } from 'src/users/users.service';
import { NotFoundException } from '@nestjs/common';
import { Link } from '@prisma/client';

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

  it('should get a link', async () => {
    prismaService.link.findUniqueOrThrow = jest.fn().mockImplementation(() => {
      return {
        id: 1,
        url: 'https://testing.com',
        slug: 'testing',
      };
    });

    const link = await service.getLink({
      slug: 'testing',
    });

    expect(link).toEqual({
      id: 1,
      url: 'https://testing.com',
      slug: 'testing',
    });
  });

  it('should throw if link is not found', async () => {
    prismaService.link.findUniqueOrThrow = jest.fn().mockImplementation(() => {
      throw new NotFoundException({
        statusCode: 404,
        message: '[P2025]: No Link found',
      });
    });

    await expect(service.getLink({ slug: 'testing' })).rejects.toThrow(NotFoundException);
  });

  it('should update clicks count', async () => {
    prismaService.link.update = jest.fn().mockImplementation(() => {});

    await service.updateClicksCount({
      id: 1,
      clicks: 1,
    } as Link);

    expect(prismaService.link.update).toHaveBeenCalledTimes(1);
  });
});

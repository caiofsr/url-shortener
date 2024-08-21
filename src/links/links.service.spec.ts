import { Link } from '@prisma/client';
import { TestBed } from '@automock/jest';
import { PrismaService } from 'nestjs-prisma';
import { LinksService } from './links.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

describe('LinksService', () => {
  let service: LinksService;
  let usersService: jest.Mocked<UsersService>;
  let configService: jest.Mocked<ConfigService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(LinksService).compile();

    service = unit;
    usersService = unitRef.get<UsersService>(UsersService);
    prismaService = unitRef.get<PrismaService>(PrismaService);
    configService = unitRef.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLink', () => {
    it('should create link without user', async () => {
      prismaService.link.create = jest.fn().mockImplementation(() => {
        return {
          id: 1,
          url: 'https://testing.com',
          slug: 'testing',
        };
      });

      configService.getOrThrow.mockImplementation(() => 'localhost');

      const link = await service.createLink({
        url: 'https://testing.com',
      });

      expect(link).toEqual({
        link: 'localhost/testing',
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

      configService.getOrThrow.mockImplementation(() => 'localhost');

      const link = await service.createLink({
        url: 'https://testing.com',
        user: {
          userId: 1,
          email: 'testing@example.com',
        },
      });

      expect(link).toEqual({
        link: 'localhost/testing',
      });
    });
  });

  describe('getLink', () => {
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

  it('should get links', async () => {
    const user = {
      userId: 1,
      email: 'testing@example.com',
    };

    const link = {
      id: 1,
      url: 'https://testing.com',
      slug: 'testing',
      clicks: 0,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    prismaService.link.findMany = jest.fn().mockImplementation(() => {
      return [link];
    });

    const links = await service.getLinks(user);

    expect(links).toEqual([link]);
  });
});

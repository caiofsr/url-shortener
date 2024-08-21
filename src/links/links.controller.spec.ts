import { Response } from 'express';
import { TestBed } from '@automock/jest';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';

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

  describe('shortenLink', () => {
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

  describe('getLinks', () => {
    it('should get links', async () => {
      const user: TokenPayload = {
        userId: 1,
        email: 'testing@example.com',
      };

      const link = {
        id: 1,
        url: 'https://testing.com',
        slug: 'testing',
        clicks: 0,
        userId: user.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      linksService.getLinks = jest.fn().mockImplementation(() => {
        return [link];
      });

      const links = await controller.getLinks(user);

      expect(links).toEqual([link]);
    });

    it('should throw if user is not logged in', async () => {
      expect(() => controller.getLinks()).toThrow(UnauthorizedException);
    });
  });

  describe('redirect', () => {
    it('should call redirect', async () => {
      linksService.getLink = jest.fn().mockImplementation(() => {
        return {
          id: 1,
          url: 'https://testing.com',
          slug: 'testing',
        };
      });

      const res = {} as unknown as Response;
      res.redirect = jest.fn();

      await controller.redirect('testing', res);

      expect(res.redirect).toHaveBeenCalledWith('https://testing.com');
    });
  });

  describe('deleteLink', () => {
    it('should delete link', async () => {
      linksService.deleteLink.mockResolvedValue();

      await controller.deleteLink('1', { userId: 1, email: 'testing@example.com' });
      expect(linksService.deleteLink).toHaveBeenCalledTimes(1);
    });

    it('should throw if user is not logged in', async () => {
      linksService.deleteLink.mockResolvedValue();

      expect(() => controller.deleteLink('1')).rejects.toThrow(UnauthorizedException);
      expect(linksService.deleteLink).toHaveBeenCalledTimes(0);
    });
  });
});

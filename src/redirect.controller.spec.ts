import { TestBed } from '@automock/jest';
import { RedirectController } from './redirect.controller';
import { LinksService } from './links/links.service';
import { Response } from 'express';

jest.mock('express');

describe('RedirectController', () => {
  let controller: RedirectController;
  let linksService: jest.Mocked<LinksService>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(RedirectController).compile();

    controller = unit;
    linksService = unitRef.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

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

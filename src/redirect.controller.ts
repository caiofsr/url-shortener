import { Controller, Get, Param, Res } from '@nestjs/common';
import { LinksService } from './links/links.service';
import { Response } from 'express';

@Controller()
export class RedirectController {
  constructor(protected readonly linksService: LinksService) {}

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const link = await this.linksService.getLink({ slug });

    await this.linksService.updateClicksCount(link);

    res.redirect(link.url);
  }
}

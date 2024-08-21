import { Response } from 'express';
import { LinksService } from './links.service';
import { ShortenLinkDto } from './dtos/shorten-link.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/ current-user.decorator';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { Body, Controller, Get, Param, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';

@Controller()
export class LinksController {
  constructor(protected readonly linksService: LinksService) {}

  @Post('/links')
  @UseGuards(JwtAuthGuard)
  shorten(@Body() body: ShortenLinkDto, @CurrentUser() user?: TokenPayload) {
    return this.linksService.createLink({ url: body.url, user });
  }

  @Get('/links')
  @UseGuards(JwtAuthGuard)
  getLinks(@CurrentUser() user?: TokenPayload) {
    if (!user) {
      throw new UnauthorizedException('You are not allowed to access this resource');
    }

    return this.linksService.getLinks(user);
  }

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const link = await this.linksService.getLink({ slug });

    await this.linksService.updateClicksCount(link);

    res.redirect(link.url);
  }
}

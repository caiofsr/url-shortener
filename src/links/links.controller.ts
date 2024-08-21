import { Response } from 'express';
import { LinksService } from './links.service';
import { UpdateLinkDto } from './dtos/update-link.dto';
import { ShortenLinkDto } from './dtos/shorten-link.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/ current-user.decorator';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import {
  Get,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  UnauthorizedException,
} from '@nestjs/common';

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

  @Delete('/links/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLink(@Param('id') id: string, @CurrentUser() user?: TokenPayload) {
    if (!user) {
      throw new UnauthorizedException('You are not allowed to access this resource');
    }

    await this.linksService.deleteLink({ id: Number.parseInt(id), user });
  }

  @Patch('/links/:id')
  @UseGuards(JwtAuthGuard)
  async updateLink(@Param('id') id: string, @Body() body: UpdateLinkDto, @CurrentUser() user?: TokenPayload) {
    if (!user) {
      throw new UnauthorizedException('You are not allowed to access this resource');
    }

    return this.linksService.updateLink({ id: Number.parseInt(id), user, ...body });
  }

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const link = await this.linksService.getLink({ slug });

    await this.linksService.updateClicksCount(link);

    res.redirect(link.url);
  }
}

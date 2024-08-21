import { Response } from 'express';
import { LinksService } from './links.service';
import { UpdateLinkDto } from './dtos/update-link.dto';
import { ShortenLinkDto } from './dtos/shorten-link.dto';
import { ResponseLinkDto } from './dtos/response-link.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/ current-user.decorator';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
@ApiTags('Links')
export class LinksController {
  constructor(protected readonly linksService: LinksService) {}

  @Post('/links')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Shorten a link' })
  @ApiResponse({
    status: 201,
    description: 'Link created',
    example: { link: 'http://test.com/Iaid9S' },
  })
  shorten(@Body() body: ShortenLinkDto, @CurrentUser() user?: TokenPayload) {
    return this.linksService.createLink({ url: body.url, user });
  }

  @Get('/links')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all links of an user' })
  @ApiResponse({ status: 200, description: 'Links found', type: [ResponseLinkDto] })
  getLinks(@CurrentUser() user?: TokenPayload) {
    if (!user) {
      throw new UnauthorizedException('You are not allowed to access this resource');
    }

    return this.linksService.getLinks(user);
  }

  @Delete('/links/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete a link' })
  @ApiResponse({ status: 204, description: 'Link deleted' })
  async deleteLink(@Param('id') id: string, @CurrentUser() user?: TokenPayload) {
    if (!user) {
      throw new UnauthorizedException('You are not allowed to access this resource');
    }

    await this.linksService.deleteLink({ id: Number.parseInt(id), user });
  }

  @Patch('/links/:id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update a link' })
  @ApiResponse({ status: 200, description: 'Link updated', type: ResponseLinkDto })
  async updateLink(@Param('id') id: string, @Body() body: UpdateLinkDto, @CurrentUser() user?: TokenPayload) {
    if (!user) {
      throw new UnauthorizedException('You are not allowed to access this resource');
    }

    return this.linksService.updateLink({ id: Number.parseInt(id), user, ...body });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Redirect to link' })
  @ApiResponse({ status: 302, description: 'Redirect to link' })
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const link = await this.linksService.getLink({ slug });

    await this.linksService.updateClicksCount(link);

    res.redirect(link.url);
  }
}

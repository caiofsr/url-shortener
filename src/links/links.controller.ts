import { LinksService } from './links.service';
import { ShortenLinkDto } from './dtos/shorten-link.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/ current-user.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';

@Controller('links')
export class LinksController {
  constructor(protected readonly linksService: LinksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  shorten(@Body() body: ShortenLinkDto, @CurrentUser() user?: TokenPayload) {
    return this.linksService.createLink({ url: body.url, user });
  }
}

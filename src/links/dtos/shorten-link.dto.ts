import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';

export class ShortenLinkDto {
  @ApiProperty()
  @IsUrl()
  url: string;
}

export type CreateLinkDto = {
  url: string;
  user?: TokenPayload;
};

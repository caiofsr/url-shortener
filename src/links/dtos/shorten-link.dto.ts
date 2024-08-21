import { IsUrl } from 'class-validator';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';

export class ShortenLinkDto {
  @IsUrl()
  url: string;
}

export type CreateLinkDto = {
  url: string;
  user?: TokenPayload;
};

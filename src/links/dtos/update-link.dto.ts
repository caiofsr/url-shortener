import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLinkDto {
  @IsUrl()
  @ApiProperty()
  url: string;
}

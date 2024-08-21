import { ApiProperty } from '@nestjs/swagger';

export class ResponseLinkDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  url: string;
  @ApiProperty()
  slug: string;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  clicks: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
}

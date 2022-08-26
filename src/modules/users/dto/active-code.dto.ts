import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActiveCodeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  code: string;
}

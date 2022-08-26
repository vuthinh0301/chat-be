import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendActiveCodeDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ type: String, required: true })
  email: string;
}

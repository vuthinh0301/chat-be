import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LessonIdDto {
  @ApiProperty({
    required: true,
    default: '',
  })
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  lessonId: string;
}

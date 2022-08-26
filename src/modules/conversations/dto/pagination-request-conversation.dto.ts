import { PaginationRequestFullDto } from '@/dtos/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);

export class PaginationRequestConversationDto extends PaginationRequestFullDto {
  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  lessonId: string;
}

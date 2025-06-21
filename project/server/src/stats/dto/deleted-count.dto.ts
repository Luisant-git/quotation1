// deleted-count.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DeletedCountDto {
  @ApiProperty({
    example: 'party',
    description: 'The name of the entity/model',
  })
  name: string;

  @ApiProperty({
    example: 23,
    description: 'Total number of deleted records for this entity',
  })
  totalDeleted: number;
}
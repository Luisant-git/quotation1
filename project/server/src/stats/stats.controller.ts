// stats.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { DeletedCountDto } from './dto/deleted-count.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Statistics') 
@Controller('stats')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('deleted-counts')
  @ApiOperation({
    summary: 'Get counts of deleted records',
    description: 'Returns counts of records marked as deleted (Delete_flg = 1) for various entities'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved deleted counts',
    type: [DeletedCountDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getDeletedCounts(): Promise<DeletedCountDto[]> {
    return this.statsService.getDeletedCounts();
  }
}
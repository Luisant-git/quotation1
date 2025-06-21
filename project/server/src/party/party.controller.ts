import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PartyService } from './party.service';
import { CreatePartyDto } from './dto/party.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserAuditInterceptor } from 'src/interceptor/user-audit.interceptor';

@ApiTags('Party')
@Controller('party')
@UseInterceptors(UserAuditInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new party' })
  @ApiBody({ type: CreatePartyDto })
  @ApiResponse({ status: 201, description: 'Party created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or unique constraint violation',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createPartyDto: CreatePartyDto) {
    return this.partyService.create(createPartyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all parties' })
  @ApiResponse({ status: 200, description: 'List of all parties' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    return this.partyService.findAll();
  }

  @Get('deleted')
  @ApiOperation({ summary: 'Get all deleted parties' })
  @ApiResponse({ status: 200, description: 'List of all deleted parties' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAllDeleted() {
    return this.partyService.findAllDeleted();
  }

  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restore deleted parties' })
  @ApiResponse({ status: 200, description: 'Parties restored successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async restoreDeleted(@Param('id', ParseIntPipe) id: number) {
    return this.partyService.restoreDelete(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a party by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Party ID' })
  @ApiResponse({ status: 200, description: 'Party found' })
  @ApiResponse({ status: 404, description: 'Party not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a party' })
  @ApiParam({ name: 'id', type: Number, description: 'Party ID' })
  @ApiBody({ type: CreatePartyDto })
  @ApiResponse({ status: 200, description: 'Party updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or unique constraint violation',
  })
  @ApiResponse({ status: 404, description: 'Party not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartyDto: CreatePartyDto,
  ) {
    return this.partyService.update(id, updatePartyDto);
  }

  @Delete(':ptycode')
  async remove(
    @Param('ptycode') ptycode: string,
    @Body('deletedBy') deletedBy: number,
  ) {
    try {
      return await this.partyService.remove(+ptycode, deletedBy);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

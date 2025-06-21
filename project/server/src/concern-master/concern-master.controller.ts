import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ConcernMasterService } from './concern-master.service';
import { CreateConcernMasterDto } from './dto/create-concern-master.dto';
import { UpdateConcernMasterDto } from './dto/update-concern-master.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserAuditInterceptor } from 'src/interceptor/user-audit.interceptor';

@ApiTags('Concern Master')
@Controller('concern-master')
@ApiBearerAuth()
@UseInterceptors(UserAuditInterceptor)


export class ConcernMasterController {
  constructor(private readonly concernMasterService: ConcernMasterService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new Concern Master record' })
  @ApiResponse({ status: 201, description: 'Record created successfully' })
  async create(@Body() createConcernMasterDto: CreateConcernMasterDto) {
    return this.concernMasterService.create(createConcernMasterDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all Concern Master records' })
  @ApiResponse({ status: 200, description: 'List of all records' })
  async findAll() {
    return this.concernMasterService.findAll();
  }

  @Get('lookup')
  @ApiOperation({ summary: 'Get all Concern Master records' })
  @ApiResponse({ status: 200, description: 'List of all records' })
  async lookup() {
    return this.concernMasterService.lookup();
  }



  @Get('deleted')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all deleted Concern Master records' })
  @ApiResponse({ status: 200, description: 'List of all deleted records' })
  async findDeleted() {
    return this.concernMasterService.findDeleted();
  }

  @Patch('restore/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Restore a deleted Concern Master record by ID' })
  @ApiResponse({ status: 200, description: 'Record restored successfully' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async restore(@Param('id') id: string) {
    return this.concernMasterService.restore(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a Concern Master record by ID' })
  @ApiResponse({ status: 200, description: 'Record updated successfully' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async update(
    @Param('id') id: string,
    @Body() updateConcernMasterDto: UpdateConcernMasterDto,
  ) {
    return this.concernMasterService.update(+id, updateConcernMasterDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a Concern Master record by ID' })
  @ApiResponse({ status: 200, description: 'Record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async remove(@Param('id') id: string) {
    return this.concernMasterService.remove(+id);
  }
}

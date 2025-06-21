import { Controller, Post, Get, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClothDetailService } from './cloth-detail.service';
import { CreateClothDetailDto } from './dto/cloth-detail.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('ClothDetail')
@Controller('cloth-detail')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ClothDetailController {
  constructor(private readonly clothDetailService: ClothDetailService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ClothDetail' })
  async create(@Body() data: CreateClothDetailDto) {
    return this.clothDetailService.createClothDetail(data);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all ClothDetails' })
  async findAll() {
    return this.clothDetailService.getClothDetails();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a ClothDetail by ID' })
  async findOne(@Param('id') id: number) {
    return this.clothDetailService.getClothDetailById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ClothDetail by ID' })
  async update(@Param('id') id: number, @Body() data: CreateClothDetailDto) {
    return this.clothDetailService.updateClothDetail(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ClothDetail by ID' })
  async delete(@Param('id') id: number) {
    return this.clothDetailService.deleteClothDetail(id);
  }
}

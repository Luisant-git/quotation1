import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Res,
  HttpStatus,
  NotFoundException,
  ConflictException,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ItemService } from './item.service';
import { CreateItemMasterDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserAuditInterceptor } from 'src/interceptor/user-audit.interceptor';

@ApiTags('item')
@Controller('items')
@ApiBearerAuth()
@UseInterceptors(UserAuditInterceptor)
@UseGuards(AuthGuard('jwt'))
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create item' })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createItemDto: CreateItemMasterDto,
    @Res() res: Response,
  ) {
    try {
      const item = await this.itemService.createItem(createItemDto);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.getResponse());
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to create item',
        error: error.message || error,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'Items retrieved successfully' })
  async findAll(@Res() res: Response) {
    try {
      const items = await this.itemService.findAll();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Items retrieved successfully',
        data: items,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to retrieve items',
        error: error.message || error,
      });
    }
  }

  @Get('deleted')
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'Items retrieved successfully' })
  async findDeleted(@Res() res: Response) {
    try {
      const items = await this.itemService.findDeleted();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Items retrieved successfully',
        data: items,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to retrieve items',
        error: error.message || error,
      });
    }
  }


  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restore deleted items' })
  @ApiResponse({ status: 200, description: 'Items restored successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async restoreDeleted(@Param('id',ParseIntPipe) id: number) {
    return this.itemService.restoreDelete(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const item = await this.itemService.findOne(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Item retrieved successfully',
        data: item,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Item not found',
        error: error.message || error,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
    @Res() res: Response,
  ) {
    try {
      const updatedItem = await this.itemService.update(id, updateItemDto);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Item updated successfully',
        data: updatedItem,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.getResponse());
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to update item',
        error: error.message || error,
      });
    }
  }

  @Delete(':id')

  async remove(@Param('id') id: string, @Body('deletedBy') deletedBy: number) {
    try {
      return await this.itemService.remove(+id, deletedBy);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

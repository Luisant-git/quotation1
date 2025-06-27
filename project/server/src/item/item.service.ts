import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemMasterDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(createItemDto: CreateItemMasterDto) {
    try {
      return await this.prisma.itemMaster.create({ 
        data: {
          ...createItemDto,
          Delete_flg: 0,
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Handle unique constraint violations
        const target = error.meta?.target;
        
        // Custom messages for specific unique constraints
        if (target === 'ItemMaster_itemCode_key') {
          throw new ConflictException(
            `Item with code "${createItemDto.itemCode}" already exists. Please use a different item code.`
          );
        } else if (target === 'ItemMaster_itemName_key') {
          throw new ConflictException(
            `Item with name "${createItemDto.itemName}" already exists. Please use a different name.`
          );
        } else if (Array.isArray(target) && target.includes('itemCode') && target.includes('itemName') && 
                   target.includes('hsnCode') && target.includes('size') && target.includes('color')) {
          // Check which specific fields are duplicates
          const duplicateFields = await this.findDuplicateFields(createItemDto, target);
          
          throw new ConflictException(
            duplicateFields.length > 0
              ? `Item with these existing properties already exists: ${duplicateFields.join(', ')}. Please provide unique values.`
              : 'An item with this combination of properties already exists.'
          );
        } else {
          // Fallback for other unique constraints
          throw new ConflictException(
            'Duplicate entry. The item already exists .Please choose a different name.'
          );
        }
      } else if (error.code === 'P2003') {
        // Handle foreign key constraint violations
        const fieldName = error.meta?.field_name || 'unknown field';
        let friendlyMessage = 'Reference error: ';
        
        if (fieldName.includes('createdBy') || fieldName.includes('updatedBy') || fieldName.includes('deletedBy')) {
          friendlyMessage = 'The specified user does not exist.';
        } else if (fieldName.includes('concernId')) {
          friendlyMessage = 'The specified concern/company does not exist.';
        } else {
          friendlyMessage = `Invalid reference in field: ${fieldName.replace('ItemMaster_', '').replace('_fkey', '')}`;
        }
        
        throw new BadRequestException(friendlyMessage);
      }
      
      console.error('Error creating item:', error);
      throw new InternalServerErrorException(
        'Failed to create item due to an unexpected error.',
      );
    }
  }
  
  private async findDuplicateFields(createItemDto: CreateItemMasterDto, targetFields: string[]): Promise<string[]> {
    const duplicateFields: string[] = [];
    
    // Check each field for duplicates
    for (const field of targetFields) {
      if (createItemDto[field as keyof CreateItemMasterDto]) {
        const existing = await this.prisma.itemMaster.findFirst({
          where: { [field]: createItemDto[field as keyof CreateItemMasterDto] },
        });
        if (existing) duplicateFields.push(field);
      }
    }
    
    return duplicateFields;
  }


  async findDeleted(){
    try {
      return await this.prisma.itemMaster.findMany({
        where: {
          Delete_flg: 1,
        },
      });
    } catch (error) {
      console.error('Error finding items:', error);
      throw new InternalServerErrorException({
        message: 'Failed to retrieve items',
        error: error.message,
        details: error.meta || null,
      });
    }
  }

  async restoreDelete(id:any){
 
    try {
      return await this.prisma.itemMaster.update({
        where: { id: id },
        data: {
          Delete_flg: 0,
        },
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      throw new InternalServerErrorException('Failed to delete item.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.itemMaster.findMany({
        orderBy: [
          { updatedAt: 'desc' }, 
          { createdAt: 'desc' }  
        ],
        where: {
          Delete_flg: 0,
        },
        include:{
          PurchaseDetail: true,
        }
      });
    } catch (error) {
      console.error('Error finding items:', error);
      throw new InternalServerErrorException({
        message: 'Failed to retrieve items',
        error: error.message,
        details: error.meta || null,
      });
    }
  }
  

  async findOne(id: number) {
    try {
      const item = await this.prisma.itemMaster.findUnique({
        where: { id },
      });
      if (!item) {
        throw new NotFoundException({
          message: 'Item not found',
          error: `No item found with id: ${id}`,
        });
      }
      return item;
    } catch (error) {
      console.error('Error finding item:', error);
      throw new NotFoundException({
        message: 'Item not found',
        error: error.message,
        details: error.meta || null,
      });
    }
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    try {
      console.log('Updating item with ID:', id);
      console.log('Update data:', updateItemDto);
  
      const updatedItem = await this.prisma.itemMaster.update({
        where: { id },
        data: {
          ...updateItemDto,
          gstPercent: parseFloat(updateItemDto.gstPercent.toString()), // Ensure gstPercent is a float
        },
      });
  
      console.log('Item updated successfully:', updatedItem);
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
  
      if (error.code === 'P2002') {
        throw new ConflictException({
          message: 'Already exists. Please use a different item',
          error: error.meta.target,
        });
      }
  
      throw new BadRequestException({
        message: 'Failed to update item',
        error: error.message,
        details: error.meta || null,
      });
    }
  }
  
  async remove(id: number, deletedBy: number) {
    try {
 
      return await this.prisma.itemMaster.update({
        where: { id },
        data: {
          Delete_flg: 1,
          deletedBy, 
          DeletedDate: new Date(), 
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException({
          message: 'Cannot delete item because it is referenced by other records',
          error: error.message,
          details: error.meta || null,
        });
      }
      console.error('Error deleting item:', error);
      throw new NotFoundException({
        message: 'Item not found',
        error: error.message,
        details: error.meta || null,
      });
    }
  }
}

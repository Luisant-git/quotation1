import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartyDto } from './dto/party.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PartyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPartyDto: CreatePartyDto) {
    try {
      return await this.prisma.party.create({ 
        data: {
          ...createPartyDto,
          Delete_flg: 0, 
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `A party with name "${createPartyDto.Ptyname}" already exists. Please choose a different name.`,
        );
      } else if (error.code === 'P2003') {
        const fieldName = error.meta?.field_name || 'unknown field';
        let friendlyMessage = 'Reference error: ';
        if (fieldName.includes('State_id')) {
          friendlyMessage = 'The selected state does not exist. Please choose a valid state.';
        } else if (fieldName.includes('createdBy') || fieldName.includes('updatedBy') || fieldName.includes('deletedBy')) {
          friendlyMessage = 'The specified user does not exist.';
        } else if (fieldName.includes('concernId')) {
          friendlyMessage = 'The specified concern/company does not exist.';
        } else {
          friendlyMessage = `Invalid reference in field: ${fieldName.replace('Party_', '').replace('_fkey', '')}`;
        }
        
        throw new BadRequestException(friendlyMessage);
      }
      console.error('Error creating party:', error);
      throw new InternalServerErrorException(
        'Failed to create party due to an unexpected error.',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.party.findMany({
        where: {
          Delete_flg: 0,
        },
      });
    } catch (error) {
      console.error('Error fetching parties:', error);
      throw new InternalServerErrorException('Failed to fetch parties.');
    }
  }
  
async findAllDeleted() {
    try {
      return await this.prisma.party.findMany({
        where: {
          Delete_flg: 1,
        },
      });
    } catch (error) {
      console.error('Error fetching parties:', error);
      throw new InternalServerErrorException('Failed to fetch parties.');
    }
  } 
  
  async restoreDelete(id:any){
 
    try {
      return await this.prisma.party.update({
        where: { ptycode: id },
        data: {
          Delete_flg: 0,
        },
      });
    } catch (error) {
      console.error('Error deleting party:', error);
      throw new InternalServerErrorException('Failed to delete party.');
    }

  }

  async findOne(id: number) {
    try {
      const party = await this.prisma.party.findUnique({
        where: { ptycode: id },
      });
      if (!party) {
        throw new NotFoundException(`Party with ID ${id} not found.`);
      }
      return party;
    } catch (error) {
      console.error('Error fetching party:', error);
      throw new InternalServerErrorException('Failed to fetch party.');
    }
  }

  async update(id: number, updatePartyDto: CreatePartyDto) {
    try {
      const updatedParty = await this.prisma.party.update({
        where: { ptycode: id },
        data: {
          ...updatePartyDto,
          updatedAt: new Date()
        },
      });
      return updatedParty;
    } catch (error) {
      if (error.code === 'P2025') {
        // Record not found
        throw new NotFoundException(`Party with ID ${id} not found.`);
      } else if (error.code === 'P2002') {
        // Unique constraint violation
        const target = error.meta?.target || 'unknown field';
        let fieldName = 'Party name';
        
        if (target.includes('Ptyname')) {
          fieldName = 'Party name';
        }
        
        throw new BadRequestException(
          `A party with this ${fieldName} already exists. Please choose a different ${fieldName}.`,
        );
      } else if (error.code === 'P2003') {
        // Foreign key constraint violation
        const fieldName = error.meta?.field_name || 'unknown field';
        let friendlyMessage = 'Reference error: ';
        
        if (fieldName.includes('State_id')) {
          friendlyMessage = 'The selected state does not exist. Please choose a valid state.';
        } else if (fieldName.includes('updatedBy') || fieldName.includes('createdBy') || fieldName.includes('deletedBy')) {
          friendlyMessage = 'The specified user does not exist.';
        } else if (fieldName.includes('concernId')) {
          friendlyMessage = 'The specified concern/company does not exist.';
        } else {
          friendlyMessage = `Invalid reference in field: ${fieldName.replace('Party_', '').replace('_fkey', '')}`;
        }
        
        throw new BadRequestException(friendlyMessage);
      } else if (error.code === 'P2016') {
        throw new NotFoundException(`Party with ID ${id} not found.`);
      }
      
      console.error('Error updating party:', error);
      throw new InternalServerErrorException(
        'Failed to update party due to an unexpected error.',
      );
    }
  }
  async remove(ptycode: number, deletedBy: number) {
    try {
      return await this.prisma.party.update({
        where: { ptycode },
        data: {
          Delete_flg: 1,
          deletedBy,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException({
          message:
            'Cannot delete party because it is referenced by other records',
          error: error.message,
          details: error.meta || null,
        });
      }
      console.error('Error deleting party:', error);
      throw new NotFoundException({
        message: 'Party not found',
        error: error.message,
        details: error.meta || null,
      });
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConcernMasterDto } from './dto/create-concern-master.dto';
import { UpdateConcernMasterDto } from './dto/update-concern-master.dto';

@Injectable()
export class ConcernMasterService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateConcernMasterDto) {
    return this.prisma.concern_Master.create({ data });
  }

  async findAll() {
    return this.prisma.concern_Master.findMany({
      where: {
        Delete_flg: 0,
      },
      orderBy: {
        HeaderId: 'desc',
      },
    });
  }



  async findDeleted(){
    return this.prisma.concern_Master.findMany({where:{Delete_flg:1}})
  }

  async restore(id:any){
    return this.prisma.concern_Master.update({where:{HeaderId:id},data:{Delete_flg:0}})
  }

  async update(id: number, data: UpdateConcernMasterDto) {
    return this.prisma.concern_Master.update({ where: { HeaderId: id }, data });
  }

  async lookup() {
    return this.prisma.concern_Master.findMany({
      select: {
        HeaderId: true,
        Concern_Name: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.concern_Master.update({
      where: { HeaderId: id },
      data: { Delete_flg: 1 },
    });
  }
}

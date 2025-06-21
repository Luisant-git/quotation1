import { PartialType } from '@nestjs/swagger';
import { CreateItemMasterDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemMasterDto) {}

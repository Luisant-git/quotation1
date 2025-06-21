import { PartialType } from '@nestjs/mapped-types';
import { CreateConcernMasterDto } from './create-concern-master.dto';

export class UpdateConcernMasterDto extends PartialType(CreateConcernMasterDto) {}

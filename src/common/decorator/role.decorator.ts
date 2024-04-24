import { SetMetadata } from '@nestjs/common';
import {Role} from '../enums/role.enum';

export const Roles = (role: Role) =>{
    // console.log(role)
    return SetMetadata('role', [role])};
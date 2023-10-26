
import moment from 'moment';
import crypto from 'crypto';
import { EntityManager, getManager } from 'typeorm';
import {
    Controller, Log, Post, ReadOnly, Get, Permission, PxpError
} from '@pxp-nd/core';

import RolModel from '../entity/Rol';


class Rol extends Controller {

    @Get()
    @ReadOnly(true)
    @Log(true)
    //@Permission(true)
    async  listaDD(params: Record<string, unknown>): Promise<any> {
        
        const queryBuilder = getManager()
            .createQueryBuilder()
            .select('rol.id', 'id')
            .addSelect('rol.nombre', 'name')
            .from(RolModel, 'rol')
            .where("rol.bandera = 'AETN'")
            .andWhere("rol.estadoRegistro = 'activo'");

        const result = await queryBuilder.getRawMany();

        return result;

    }

}

export default Rol;
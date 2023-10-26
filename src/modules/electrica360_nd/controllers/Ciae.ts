
import moment from 'moment';
import crypto from 'crypto';
import { EntityManager, getManager } from 'typeorm';
import {
    Controller, Log, Post, ReadOnly, Get, Permission, PxpError
} from '@pxp-nd/core';

import FuncionarioEmpresaModel from '../entity/FuncionarioEmpresa';
import FuncionarioCiaeModel from '../entity/FuncionarioCiae';
import CiaeModel from '../entity/Ciae';


class Ciae extends Controller {

    @Get()
    @ReadOnly(true)
    @Log(true)
    //@Permission(true)
    async  listaDD(params: Record<string, unknown>): Promise<any> {
        const funcionarioEmpresa = await FuncionarioEmpresaModel.findOne({
            where: { idUsuario: this.user.userId, estadoReg: 'activo' },
        });

        if (!funcionarioEmpresa) {
            throw new PxpError(400, 'El usuario no esta asignado a la empresa');
        }

        const queryBuilder = getManager()
            .createQueryBuilder()
            .select('ciae.id', 'id')
            .addSelect('ciae.codigoCiae', 'name')
            .from(FuncionarioCiaeModel, 'funcionarioCiae')
            .innerJoin(CiaeModel, 'ciae', 'funcionarioCiae.idCiae = ciae.id')
            .where('funcionarioCiae.idFuncionarioEmpresa = :idFuncionarioEmpresa', { idFuncionarioEmpresa: funcionarioEmpresa.id })
            .andWhere("funcionarioCiae.estadoReg = 'activo'")
            .andWhere("ciae.estadoReg = 'activo'");

        const result = await queryBuilder.getRawMany();

        return result;

    }

}

export default Ciae;
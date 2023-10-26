
import {
    Controller, Log, Post, ReadOnly, Get, Permission, PxpError
} from '@pxp-nd/core';

import Driver  from '../../../helpers/Driver';

class Depto extends Controller {

    @Post()
    @ReadOnly(true)
    @Log(true)
    //@Permission(true)
    async  insertDepto(params: Record<string, unknown>): Promise<any> {

        const driver = new Driver();

        const configRequest = {
            procedure: 'param.ft_depto_ime',
            transaction: 'PM_DEPPTO_INS',
            userId: this.user.userId as number,
            createParameters: [
                { name: '_nombre_usuario_ai', value: 'test', type: 'varchar' },
                { name: '_id_usuario_ai', value: this.user.userId, type: 'int4' },
                { name: 'id_entidad', value: params.id_entidad, type: 'int4' },
                { name: 'modulo', value: params.modulo, type: 'varchar' },
                { name: 'prioridad', value: params.prioridad, type: 'int4' },
                { name: 'id_lugares', value: params.id_lugares, type: 'varchar' },
                { name: 'nombre_corto', value: params.nombre_corto, type: 'varchar' },
                { name: 'nombre', value: params.nombre, type: 'varchar' },
                { name: 'id_subsistema', value: params.id_subsistema, type: 'int4' },
                { name: 'codigo', value: params.codigo  , type: 'varchar' }
            ]
        };
        
        const resp = await driver.callCRUD(configRequest);
        return resp;
    }

    @Get()
    @ReadOnly(true)
    @Log(true)
    //@Permission(true)
    async listarDepto(params: Record<any, any>): Promise<unknown> {
        const driver = new Driver();
        const configRequest = {
            procedure: 'param.ft_depto_sel',
            transaction: 'PM_DEPPTO_SEL',
            countTrasaction: 'PM_DEPPTO_CONT',
            userId: this.user.userId as number,

            createParameters: [
                { name: '_nombre_usuario_ai', value: 'test', type: 'varchar' },
                { name: '_id_usuario_ai', value: 0, type: 'int4' },
                { name: 'puntero', value: params.start, type: 'int4' },
                { name: 'ordenacion', value: params.sort, type: 'varchar' },
                { name: 'dir_ordenacion', value: params.dir, type: 'varchar' },
                { name: 'cantidad', value: params.limit, type: 'int4' },
                { name: 'filtro', value: ' 1=1 ', type: 'varchar' },
                { name: 'id_subsistema', value: params.id_subsistema|| '', type: 'int4' },
                { name: 'codigo_subsistema', value: params.codigo_subsistema , type: 'varchar' },
                { name: 'tipo_filtro', value: params.tipo_filtro ||' null', type: 'varchar' }
            ]
        };

        const resp = await driver.callSEL(configRequest);
        return resp;
    }


}

export default Depto;
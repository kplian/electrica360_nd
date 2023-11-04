
import {
    Controller, Log, Post, ReadOnly, Get, Permission, PxpError
} from '@pxp-nd/core';

import Driver  from '../../../helpers/Driver';

class Formulario extends Controller {

    @Get()
    @ReadOnly(true)
    @Log(true)
    //@Permission(true)
    async listarFormulario(params: Record<any, any>): Promise<unknown> {
        const driver = new Driver();
        let filtro = ' 0 = 0 ';
        if (params.idCiae) {
            filtro += ` AND fise.id_ciae = ${params.idCiae} `;
        }   

        if (params.estado) {
            filtro += ` AND fise.estado = ''${params.estado}'' `;
        }

        if (params.idTipoFormulario) {
            filtro += ` AND fise.id_tipo_formulario = ${params.idTipoFormulario} `;
        }
        const configRequest = {
            procedure: 'ele.ft_formulario_sel',
            transaction: 'ELE_FISE_SEL',
            countTrasaction: 'ELE_FISE_CONT',
            userId: this.user.userId as number,

            createParameters: [
                { name: '_nombre_usuario_ai', value: 'test', type: 'varchar' },
                { name: '_id_usuario_ai', value: 0, type: 'int4' },
                { name: 'puntero', value: params.start, type: 'int4' },
                { name: 'ordenacion', value: params.sort, type: 'varchar' },
                { name: 'dir_ordenacion', value: params.dir, type: 'varchar' },
                { name: 'cantidad', value: params.limit, type: 'int4' },
                { name: 'filtro', value: filtro, type: 'varchar' },
                { name: 'anio', value: params.anio, type: 'varchar' },
                { name: 'mes', value: params.mes, type: 'varchar' },
            ]
        };
        console.log(configRequest);

        const resp = await driver.callSEL(configRequest);
        return resp;
    }


}

export default Formulario;
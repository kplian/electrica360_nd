
import {
    Controller, Log, Post, ReadOnly, Get, Permission, PxpError
} from '@pxp-nd/core';
import { EntityManager, getManager } from 'typeorm';
import Driver  from '../../../helpers/Driver';
import { isExcelFile } from '../helpers/Files';

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

    @Post()
    @ReadOnly(false)
    @Log(true)
    //@Permission(true)
    async  uploadFile(params: Record<string, unknown>, manager: EntityManager): Promise<any> {
        const folder = './upload_folder/forms/';
        
        
        
        let excel : any  = params.file;
        const extension = isExcelFile(excel);
        if (!extension) {
            throw new PxpError(400, `Archivo invalido`);
        }
        const filename = new Date().valueOf() + '.' + extension;
        console.log(filename);
        let x = await excel.mv(folder + filename);
        return { success: true, extension };


    }


}

export default Formulario;

import {
    Controller, Log, Post, ReadOnly, Get, Permission, PxpError
} from '@pxp-nd/core';

import Driver  from '../../../helpers/Driver';

class Job extends Controller {
    @Post()
    @ReadOnly(true)
    @Log(true)
    //@Permission(true)
    async  generateMonthlyForm(params: Record<string, unknown>): Promise<any> {
        const driver = new Driver();
        const configRequest = {
            procedure: 'ele.ft_formulario_ime',
            transaction: 'ELE_GENFORM_IME',
            userId: this.user.userId as number,
            createParameters: [
                { name: '_nombre_usuario_ai', value: 'test', type: 'varchar' },
                { name: '_id_usuario_ai', value: this.user.userId, type: 'int4' },
                { name: 'fecha_app', value: params.fecha_app, type: 'date' },
            ]
        };

        driver.callCRUD(configRequest);
        return { sucess: true, message: 'running in the background'};
    }

}

export default Job;
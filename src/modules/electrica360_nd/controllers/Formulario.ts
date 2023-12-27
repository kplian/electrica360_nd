
import {
    Controller, Log, Post, ReadOnly, Get, Permission, PxpError, IsFile, Authentication
} from '@pxp-nd/core';
import { EntityManager, getManager } from 'typeorm';
import Driver  from '../../../helpers/Driver';
import { isExcelFile } from '../helpers/Files';
import { hasErrorExcel } from '../helpers/Validation';
import FormularioModel from '../entity/Formulario';
import TipoFormularioModel from '../entity/TipoFormulario';
import TablaModel from '../entity/Tabla';
import TipoColumnaModel from '../entity/TipoColumna';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as stream from 'stream';
import moment from 'moment';
import path from 'path';


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
        const queryBuilder = getManager()
            .createQueryBuilder()
            .select('tipoColumna.formTipoColumna', 'formTipoColumna')
            .addSelect('tabla.bdNombreTabla', 'bdNombreTabla')
            .addSelect('tipoColumna.formLabel', 'formLabel')
            .addSelect('tipoColumna.bdNombreColumna', 'bdNombreColumna')
            .addSelect('tipoColumna.formComboRec', 'formComboRec')
            .addSelect('tipoColumna.formSobreescribeConfig', 'formSobreescribeConfig')
            .from(FormularioModel, 'formulario')
            .innerJoin(TipoFormularioModel, 'tipoFormulario', 'tipoFormulario.idTipoFormulario = formulario.idTipoFormulario')
            .innerJoin(TablaModel, 'tabla', 'tabla.idTabla = tipoFormulario.idTabla')
            .innerJoin(TipoColumnaModel, 'tipoColumna', 'tipoColumna.idTabla = tabla.idTabla')
            .where('formulario.idFormulario = :idFormulario', { idFormulario: params.idFormulario as number })
            .orderBy('tipoColumna.orden', 'ASC');
        
        const configs = await queryBuilder.getRawMany();
        const catalogs: { [key: string]: string[] } = {};
        for (const config of configs) {
            
            if (config.formComboRec) {
                const formConfigObj = JSON.parse(config.formSobreescribeConfig)
                const sqlQuery = `  SELECT c.descripcion 
                                    FROM param.tcatalogo_tipo ct 
                                    inner join param.tcatalogo c ON c.id_catalogo_tipo = ct.id_catalogo_tipo  
                                    WHERE ct.nombre = $1`;

                // Parameters to bind to the query
                const parameters = [formConfigObj.baseParams.catalogo_tipo];
                const options = await manager.query(sqlQuery, parameters);
                if (options.length == 0) {
                    throw new PxpError(400, `Comborec ${config.formComboRec} no configurado correctamente`);
                }
                catalogs[formConfigObj.baseParams.catalogo_tipo] = options;
            }
        }

        let excel : any  = params.file;
        const extension = isExcelFile(excel);
        if (!extension) {
            throw new PxpError(400, `Archivo invalido`);
        }
        
        const filename = new Date().valueOf() + '.' + extension;
        
        let x = await excel.mv(folder + filename);
        const hasError = await hasErrorExcel(folder + filename, configs, catalogs);
        
        if (hasError) {
            return { success: false, hasError };
        } else {
            const message = await this.insertIntoTable(folder + filename, configs, params.idFormulario as number, manager);
            return { success: true, message };
        }
    }

    @Post()
    @ReadOnly(true)
    @Log(true)
    @IsFile(true)
    @Authentication(true)
    async  downloadTemplate(params: Record<string, unknown>): Promise<any> {
        const queryBuilder = getManager()
            .createQueryBuilder()
            .select('tipoColumna.formLabel', 'formLabel')
            .from(FormularioModel, 'formulario')
            .innerJoin(TipoFormularioModel, 'tipoFormulario', 'tipoFormulario.idTipoFormulario = formulario.idTipoFormulario')
            .innerJoin(TablaModel, 'tabla', 'tabla.idTabla = tipoFormulario.idTabla')
            .innerJoin(TipoColumnaModel, 'tipoColumna', 'tipoColumna.idTabla = tabla.idTabla')
            .where('formulario.idFormulario = :idFormulario', { idFormulario: params.idFormulario as number })
            .orderBy('tipoColumna.orden', 'ASC');

        let configs = await queryBuilder.getRawMany();
        configs = configs.map((item: any) => item.formLabel);
        

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');
        worksheet.addRow(configs);

        const filePath = path.join(__dirname, '../../../../upload_folder', 'forms', `temp-${params.idFormulario}.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        return filePath;
    }

    async  insertIntoTable(inputFilePath: string, configs: any, idFormulario:number, manager: EntityManager): Promise<any> {
        const workbook = new ExcelJS.Workbook();
        let count = 0;
        const readStream = fs.createReadStream(inputFilePath);
        await workbook.xlsx.read(readStream);

        const updQuery = `  UPDATE ele.t${configs[0].bdNombreTabla} 
                            SET estado_reg = 'inactivo',
                            fecha_mod = now(), 
                            id_usuario_mod = $1
                            WHERE id_formulario = $2 and estado_reg = 'activo'`;
        const resQuery = await manager.query(updQuery, [this.user.userId, idFormulario as number]);
        const worksheet: ExcelJS.Worksheet | undefined = workbook.worksheets[0];

        worksheet.eachRow(async (row: ExcelJS.Row, rowNumber: number) => {
            if (rowNumber > 1) {
              count++;
              let fields = "id_formulario, id_usuario_reg";
              let valuesString = "$1, $2";
              let valuesArray: any[] = [idFormulario as number, this.user.userId];
              let cell = 1;

              for (const config of configs) {
                const value = row.getCell(cell).value;
                if (config.formTipoColumna == 'NumberField') {
                    valuesArray.push(value as number);
                } else if (config.formTipoColumna == 'TimeField' && value instanceof Date){
                    valuesArray.push(moment.utc(value).format('HH:mm:ss'));
                } else if (config.formTipoColumna == 'DateField' && value instanceof Date){
                    valuesArray.push(moment.utc(value).format('DD/MM/YYYY'));
                } else {
                    valuesArray.push(value);
                }
                
                valuesString += `, $${cell + 2}`;
                fields += `, ${config.bdNombreColumna}`;
                cell++;
              }

              const insQuery = `  INSERT INTO ele.t${configs[0].bdNombreTabla} (${fields}) VALUES (${valuesString})`;
              const resQuery = await manager.query(insQuery, valuesArray);
              console.log(resQuery);
            }                        
            
          });
        return `${count} registros insertados`;
    }


}

export default Formulario;
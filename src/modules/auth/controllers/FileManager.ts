
import {
    Controller, Log, Post, ReadOnly, PxpError, Get, Authentication, IsFile
} from '@pxp-nd/core';
import { Response } from 'express';
import { EntityManager } from 'typeorm';
import path from 'path';
import fs from 'fs';

class FileManager extends Controller {

    @Post()
    @ReadOnly(true)
    @Log(true)
    @IsFile(true)
    @Authentication(true)
    async  download(params: Record<string, unknown>): Promise<any> {
        if (!params.file) {
          throw new PxpError(400, 'Debes definir el nombre del archivo');
        }

        if (!params.type) {
          throw new PxpError(400, 'Debes definir el tipo del archivo');
        }
        
        const filePath = path.join(__dirname, '../../../../upload_folder', params.type as string, params.file as string);
        
        try {
          await fs.promises.access(filePath, fs.constants.F_OK);
          return filePath;
        } catch (err) {
          throw new PxpError(400, 'Archivo no encontrado');
        }
    }

}

export default FileManager;
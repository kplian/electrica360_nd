/**************************************************************************
 SYSTEM/MODULE  : hq-nd
 FILE           : AmazonS3.ts
 DESCRIPTION    : Controller to manage api of amazon s3
 ***************************************************************************
 ISSUE        DATE        AUTHOR            DESCRIPTION
 #SP26AUG22  05/09/2022   Favio Figueroa    File creation(Logic for copy buckets)
 ***************************************************************************/

import { EntityManager, getManager } from 'typeorm';

import {
  Controller,
  Model, __, Log, Post, DbSettings, ReadOnly, Get, Authentication, PxpError
} from '@pxp-nd/core';
import axios from 'axios';

import util from 'util';
import fs from 'fs';

const writeFileAsync = util.promisify(fs.writeFile);

class Bnb extends Controller {

  @Post()
  @DbSettings('Orm')
  @ReadOnly(false)
  @Log(true)
  @Authentication(false)
  async token(params: any): Promise<unknown> {

    const url = 'http://test.bnb.com.bo/ClientAuthentication.API/api/v1/auth/token';
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    //console.log('Token generado:', response.data);

    return {
      ...response.data
    }
  }


  /**
   * Actualiza las credenciales de autorización.
   * @param params Debe incluir:
   *   - accountId: Identificador de cuenta de la empresa.
   *   - actualAuthorizationId: Actual autorización Id.
   *   - newAuthorizationId: Nueva autorización Id. Debe cumplir con requisitos de seguridad.
   * @param manager EntityManager de TypeORM.
   * @returns Respuesta de la API.
   */
  @Post('/updateCredentials')
  @DbSettings('Orm')
  @ReadOnly(false)
  @Log(true)
  @Authentication(false)
  async updateCredentials(params: any): Promise<unknown> {
    const getToken: any = await this.token({
      "accountId": "WCqC2jmem25wzLzgVTSDIg==", // Tu accountId proporcionado por el BNB
      "authorizationId": "Mund0libre123$*" // Tu authorizationId proporcionado por el BNB
    });
    console.log('getToken',getToken)

    const url = 'http://test.bnb.com.bo/ClientAuthentication.API/api/v1/auth/UpdateCredentials';
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken.message}`
      }
    });
    console.log('Credenciales actualizadas:', response.data);
    return response.data;
  }

  /**
   * Genera un código QR para pagos.
   * @param params Debe incluir:
   *   - currency: Moneda del pago.
   *   - gloss: Descripción del pago (Ejemplo: ID de reserva).
   *   - amount: Monto del pago.
   *   - expirationDate: Fecha de expiración del QR.
   *   - singleUse: Define si el uso del QR es único o no.
   *   - additionalData: Campo abierto opcional para datos adicionales.
   *   - destinationAccountId: Identificador de la cuenta de destino.
   * @param manager EntityManager de TypeORM.
   * @returns Datos del QR generado.
   */
  @Post('/generateQR')
  @DbSettings('Orm')
  @ReadOnly(true)
  @Log(true)
  @Authentication(false)
  async generateQR(params: any): Promise<any> {
    const folder = './upload_folder/qr/';
    const getToken: any = await this.token({
      "accountId": "WCqC2jmem25wzLzgVTSDIg==", // Tu accountId proporcionado por el BNB
      "authorizationId": "Mund0libre123$*" // Tu authorizationId proporcionado por el BNB
    });
    
    const url = 'http://test.bnb.com.bo/QRSimple.API/api/v1/main/getQRWithImageAsync';
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken.message}`
      }
    });
    
    const imageBuffer = Buffer.from(response.data.qr, 'base64');
    const filename = new Date().valueOf() + '.jpg';

    await writeFileAsync(folder + filename, imageBuffer, 'binary');
    return { type: 'qr', file: filename, id: response.data.id };
  }


  /**
   * Obtiene una lista de QRs generados en una fecha específica.
   * @param params Debe incluir:
   *   - generationDate: Fecha en la que se generaron los QRs.
   * @param manager EntityManager de TypeORM.
   * @returns Lista de QRs generados.
   */
  @Post('/getGeneratedQRList')
  @DbSettings('Orm')
  @ReadOnly(false)
  @Log(true)
  @Authentication(false)
  async getGeneratedQRList(params: any): Promise<unknown> {
    const getToken: any = await this.token({
      "accountId": "WCqC2jmem25wzLzgVTSDIg==", // Tu accountId proporcionado por el BNB
      "authorizationId": "Mund0libre123$*" // Tu authorizationId proporcionado por el BNB
    });

    const url = 'http://test.bnb.com.bo/QRSimple.API/api/v2/main/getQRbyGenerationDateAsync';
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken.message}`
      }
    });
    console.log('Lista de QRs generados:', response.data);
    return response.data;
  }

  /**
   * Obtiene el estado actual de un código QR específico.
   * @param params Debe incluir:
   *   - qrId: Identificador del código QR.
   * @param manager EntityManager de TypeORM.
   * @returns Estado actual del QR.
   */
  @Post('/getQRStatus')
  @DbSettings('Orm')
  @ReadOnly(false)
  @Log(true)
  @Authentication(false)
  async getQRStatus(params: any): Promise<unknown> {
    const getToken: any = await this.token({
      "accountId": "WCqC2jmem25wzLzgVTSDIg==", // Tu accountId proporcionado por el BNB
      "authorizationId": "Mund0libre123$*" // Tu authorizationId proporcionado por el BNB
    });
    console.log(getToken);
    const url = 'http://test.bnb.com.bo/QRSimple.API/api/v1/main/getQRStatusAsync';
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken.message}`
      }
    });
    console.log('Estado del QR:', response.data);
    return response.data;
  }

  /**
   * Cancela un código QR específico.
   * @param params Debe incluir:
   *   - qrId: Identificador del código QR a cancelar.
   * @param manager EntityManager de TypeORM.
   * @returns Confirmación de cancelación.
   */
  @Post('/cancelQR')
  @DbSettings('Orm')
  @ReadOnly(false)
  @Log(true)
  @Authentication(false)
  async cancelQR(params: any): Promise<unknown> {
    const getToken: any = await this.token({
      "accountId": "WCqC2jmem25wzLzgVTSDIg==", // Tu accountId proporcionado por el BNB
      "authorizationId": "Mund0libre123$*" // Tu authorizationId proporcionado por el BNB
    });

    const url = 'http://test.bnb.com.bo/QRSimple.API/api/v1/main/CancelQRByIdAsync';
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken.message}`
      }
    });
    console.log('QR cancelado:', response.data);
    return response.data;
  }







}

export default Bnb;


import {
    Controller, Log, Post, ReadOnly, Get, Model, PxpError,Authentication
} from '@pxp-nd/core';
import DemoCustomer from '../entity/DemoCustomer';
import Bnb from '../../payment/controllers/Bnb';

@Model('electrica360_nd/DemoPayment')
class DemoPayment extends Controller {
    @Get()
    @ReadOnly(true)
    @Log(true)
    async getPendingPayments(params: Record<any, any>): Promise<unknown> {
        if (!params.code) {
            throw new PxpError(400, `Debes enviar el codigo de cliente o documento de identidad`);
        }

        const demoCustomer = await DemoCustomer.findOne({
            where: [
              { ci: params.code as string },
              { code:  params.code as string },
            ],
          });

        if (!demoCustomer) {
            throw new PxpError(400, `Cliente no encontrado`);
        } 

        const pendingPayments = await this.model.find({ demoCustomerId: demoCustomer.demoCustomerId, status: 'pending' });

        if (pendingPayments.length == 0) {
            return { success:true, message: `Estimado ${demoCustomer.name} en este momento no cuenta con facturas pendientes` }
        }

        const resultArray: string[] = pendingPayments.map(this.formatMonthlyData);
        const resultString: string = resultArray.join('\n');

        return { success:true, message: `Estimado ${demoCustomer.name} en este momento tiene las siguientes facturas pendientes de pago: ${resultString}` }

    }

    @Post()
    @ReadOnly(true)
    @Log(true)
    async generateQr(params: Record<any, any>): Promise<unknown> {
        if (!params.code) {
            throw new PxpError(400, `Debes enviar el codigo de cliente o documento de identidad`);
        }

        const demoCustomer = await DemoCustomer.findOne({
            where: [
              { ci: params.code as string },
              { code:  params.code as string },
            ],
          });

        if (!demoCustomer) {
            throw new PxpError(400, `Cliente no encontrado`);
        } 

        const pendingPayments = await this.model.find({ 
          where: { demoCustomerId: demoCustomer.demoCustomerId, status: 'pending' },
          order: {
            year: 'ASC',
            month: 'ASC',
          },
        });
  

        if (pendingPayments.length == 0) {
            return { success:true, message: `Estimado ${demoCustomer.name} en este momento no cuenta con facturas pendientes` }
        } else {
          const description= this.formatMonthlyData(pendingPayments[0]);
          const qrParams = {
            currency: "BOB",
            gloss: description,
            amount: pendingPayments[0].amount,
            singleUse: true,
            expirationDate: "2023-12-11",
            additionalData:  `${demoCustomer.name} - ${description}`,
            destinationAccountId: "1"
          }
          const bnb = new Bnb('payment'); 
          const res = await bnb.generateQR(qrParams);
          return {
            type: 'qr', 
            file: res.file as string, 
            id: res.id as string,
            description
          }
        }

        

    }

    formatMonthlyData(monthlyData: any): string {
        const months: string[] = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
      
        const monthName = months[monthlyData.month - 1]; // Restamos 1 ya que los meses en JavaScript comienzan desde 0
        const formattedDate = `${monthName} de ${monthlyData.year}`;
      
        return `${formattedDate} monto: ${monthlyData.amount} bs`;
      }

}

export default DemoPayment;
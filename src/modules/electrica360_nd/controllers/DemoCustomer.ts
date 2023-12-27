
import {
    Controller, Log, Post, ReadOnly, Get, Model, PxpError
} from '@pxp-nd/core';
@Model('electrica360_nd/DemoCustomer')
class DemoCustomer extends Controller {
    @Get()
    @ReadOnly(true)
    @Log(true)
    //@Permission(true)
    async isValidClientCode(params: Record<any, any>): Promise<unknown> {
        if (!params.code) {
            throw new PxpError(400, `Debes enviar el codigo de cliente o documento de identidad`);
        }

        const demoCustomer = await this.model.findOne({
            where: [
              { ci: params.code as string },
              { code:  params.code as string },
            ],
          });

        if (demoCustomer) {
            return { isValidClientCode: true }
        }
        return { isValidClientCode: false }

    }

}

export default DemoCustomer;
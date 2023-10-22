
import { EntityManager, getManager, MoreThan, IsNull } from 'typeorm';
import {
    Controller, Log, Post, ReadOnly, PxpError, Get, Authentication
} from '@pxp-nd/core';
import {
    entities
} from '@pxp-nd/common';
import { validPassword, validPasswordPxpOld } from '../helpers/Password'
import { getEnv } from '../../../helpers/Env';
import * as jwt from 'jsonwebtoken';
import UserPxp from '../../electrica360_nd/entity/Usuario'
const jwtSecret = getEnv('SECRET') as string;
const pxpUserExpiresIn = getEnv('PXP_USER_EXPIRES_IN') as string;


class Login extends Controller {

    @Post()
    @ReadOnly(true)
    @Log(true)
    @Authentication(false)
    async  pxp(params: Record<string, unknown>): Promise<any> {
        let isValid = false;

        const user = await UserPxp.findOne({
            where: [
              {
                expiration: MoreThan(new Date()),
                status: "activo",
                username: params.username as string,
              },
              {
                expiration: IsNull(),
                status: "activo",
                username: params.username as string,
              },
            ],
          });
          
        if (user) {
            isValid = validPasswordPxpOld(params.password as string, user.password as string);
        }

        if (!user || !isValid) {
            throw new PxpError(401, 'Invalid username or password');
        }
        const payload = {
            id: user.userId,
            username: user.username,
            type: 'pxp-old',
          };
        
        const token = jwt.sign(payload, jwtSecret, { expiresIn: pxpUserExpiresIn as string });
        
        return { token };

    }


    @Post()
    @ReadOnly(true)
    @Log(true)
    @Authentication(false)
    async  local(params: Record<string, unknown>, manager: EntityManager): Promise<any> {
        let isValid = false;
        
        const user = await entities.User.findOne({
            where: [
              {
                expiration: MoreThan(new Date()),
                isActive: true,
                username: params.username as string,
              },
              {
                expiration: IsNull(),
                isActive: true,
                username: params.username as string,
              },
            ],
          });
        
        if (user) {
            isValid = validPassword(params.password as string, <string>user.hash, <string>user.salt);
        }

        if (!user || !isValid) {
            throw new PxpError(401, 'Invalid username or password');
        }
        const payload = {
            id: user.userId,
            username: user.username,
            type: 'pxp-nd',
          };
        
        const token = jwt.sign(payload, jwtSecret, { expiresIn: params.expiresIn as string });
        
        return { token };
    }
}

export default Login;
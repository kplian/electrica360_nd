import * as passportJWT from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { getEnv } from '../../../helpers/Env';
import {
    entities
} from '@pxp-nd/common';
import UserPxp from '../../electrica360_nd/entity/User'

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtSecret = getEnv('SECRET') as string;
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};
const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload: any, done: any) => {
    if (jwtPayload.id && jwtPayload.exp > Date.now() / 1000) {
        if (jwtPayload.type == 'pxp-nd') {
            entities.User.findOne(jwtPayload.id as number).then((user: any) => {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }

            });
        } else if (jwtPayload.type == 'pxp-old') {
            UserPxp.findOne(jwtPayload.id as number).then((user: any) => {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }

            });
        } 
    } else {
        done(null, false);
    }
    
});

export { jwtStrategy };
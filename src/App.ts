import {PxpApp} from '@pxp-nd/core';
import config from './config';
import passport from 'passport';
import { jwtStrategy }  from './modules/auth/helpers/Strategy';
import { authenticateJWT }  from './modules/auth/helpers/Middleware';
class App extends PxpApp {
  constructor() {
    super(config);
    passport.use(jwtStrategy);
    this.app.use(authenticateJWT);
  }
}

export default App;

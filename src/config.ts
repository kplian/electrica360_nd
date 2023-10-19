import { IConfigPxpApp } from '@pxp-nd/core';
import { Session, controllers as commonControllers , entities as commonEntities, commonScripts} from '@pxp-nd/common';
import { isAuthenticated } from '@pxp-nd/auth';
const config: IConfigPxpApp = {
  defaultDbSettings: 'Orm', // Orm, Procedure, Query
  apiPrefix: '/api',
  logDuration: true,
  showRoutes: true,
  session: Session,
  auth: false,
  middlewares: [isAuthenticated],
  scripts: [...commonScripts],
  modules: {
    "common":{
      entities:commonEntities,
      controllers:commonControllers
    }
  }
};

export default config;

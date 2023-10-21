import { IConfigPxpApp } from '@pxp-nd/core';
import { Session, controllers as commonControllers , entities as commonEntities, commonScripts} from '@pxp-nd/common';
import permissionFunction from './modules/auth/helpers/PermissionFunction';
const config: IConfigPxpApp = {
  defaultDbSettings: 'Orm', // Orm, Procedure, Query
  apiPrefix: '/api',
  logDuration: true,
  showRoutes: true,
  session: Session,
  auth: false,
  scripts: [...commonScripts],
  modules: {
    "common":{
      entities:commonEntities,
      controllers:commonControllers
    }
  },
  permissionFunction
};

export default config;

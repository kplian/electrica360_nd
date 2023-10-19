const { createConnections } = require('@pxp-nd/core');
const { getEnv } = require('./dist/helpers/Env');
const { entities } = require('@pxp-nd/common');
/** You can use these parameters
 * synchronize: boolean, - Indicates if database schema should be auto created on every application launch. 
 *                         Be careful with this option and don't use this in production -
 *                         otherwise you can lose production data. 
 * logging: boolean,     - If set to true then query and error logging will be enabled.
**/
const connection = {
  //  DANGER!!! DON'T TOUCH THIS PARAMETER NEVER
  //  DANGER!!! DON'T TOUCH THIS PARAMETER NEVER
  //  DANGER!!! DON'T TOUCH THIS PARAMETER NEVER
  synchronize  : false, //  DANGER!!! DON'T TOUCH THIS PARAMETER NEVER
  //  DANGER!!! DON'T TOUCH THIS PARAMETER NEVER
  //  DANGER!!! DON'T TOUCH THIS PARAMETER NEVER
  //  DANGER!!! DON'T TOUCH THIS PARAMETER NEVER	
  name: 'default',
  type: 'postgres',
  host: getEnv('DATABASE_SERVER'),
  port: getEnv('DATABASE_PORT'),
  username: getEnv('DATABASE_USER'),
  password: getEnv('DATABASE_PASSWORD'),
  database: getEnv('DATABASE_NAME'),
  logging: (getEnv('LOGGING_DATABASE') == 'true'),
  entities: {...entities},
  ...(getEnv('NODE_ENV') === 'development' && { "extra": {
     "connectionLimit": getEnv('DATABASE_CONNECTION_LIMIT')
   }})
};

module.exports = createConnections(connection);

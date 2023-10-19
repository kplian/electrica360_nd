/*****************************************************************************
 Copyright(c) 2022 Qorus Inc
 All rights reserved
 ******************************************************************************
 NAME: Encryption.ts
 DEVELOPER: Favio Figueroa
 DESCRIPTION: Env variable functionality
 REVISIONS:
 Date          Change ID    Author         Description
 ------------- ------------ -------------- ------------------------------------
 06-Jan-2023   SP02DEC22    Favio Figueroa    Created
 ******************************************************************************/

const getEnv = (name: string) => {

  if (process.env[name]) {
    return process.env[name];
  } else {
    console.log("\x1b[41m",`ERROR NOT EXIST ENV ${name}`);
    process.exit()
    process.kill(process.pid)
  }
};

export {
  getEnv
};

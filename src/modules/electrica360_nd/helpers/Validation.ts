import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as stream from 'stream';
import { v4 as uuidv4 } from 'uuid';



const folder = './upload_folder/forms/';


export async function hasErrorExcel(inputFilePath: string, configs: any, catalogs: any): Promise <boolean | { [key: string]: string }> {
  const uniqueName: string = uuidv4();
  const workbook = new ExcelJS.Workbook();
  const readStream = fs.createReadStream(inputFilePath);
  const writeStream = fs.createWriteStream(`${folder}err-${uniqueName}.txt`);
  await workbook.xlsx.read(readStream);
  const worksheet: ExcelJS.Worksheet | undefined = workbook.worksheets[0];
  let fileWritten = false;
  let headerError = false;
  let processedLines = 0;
  worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    processedLines++;
    if (rowNumber == 1) {
      let cell = 1;
      for (const config of configs) {
        if (config.formLabel != row.getCell(cell).value) {
          headerError = true;
        }
        cell++;

      }

    } else if (rowNumber > 1) {
      let cell = 1;
      for (const config of configs) {
        const hasError = valueHasError(row.getCell(cell).value, config, catalogs, cell);
        if (hasError) {
          writeStream.write(`Error en  la linea ${rowNumber}: ${hasError}\n`);
          fileWritten = true;
        }
        cell++;

      }
    }
    
  });

  writeStream.end();
  if (processedLines < 2) {
    return {
      message: 'El archivo provisto no contiene informacion'
    }
  }
  if (headerError) {
    return {
      message: 'El archivo provisto no tiene la estructura esperada. Pruebe descargando el template del formulario'
    }
  }
  if (fileWritten) {
    return {
      file: `err-${uniqueName}.txt`,
      type: 'forms'
    }
  } else {
    fs.unlink(`${folder}err-${uniqueName}.txt`, () => {
      console.log('El archivo se eliminó porque no se escribió ninguna fila.');
    });
  }
  return false;
}

const valueHasError = (value: any, config: any, catalogs: any, column: number): boolean|string => {
  if (config.formTipoColumna == 'NumberField') {
    return validateNumber(value, config.formLabel, column)
  }

  if (config.formTipoColumna == 'TextField' && config.formComboRec == 'CATALOGO') {
    const formConfigObj = JSON.parse(config.formSobreescribeConfig);
    const catalog = catalogs[formConfigObj.baseParams.catalogo_tipo];
    return validateCatalogo(value, config.formLabel, catalog, column)
  }

  if (config.formTipoColumna == 'Checkbox') {
    return validateBoolean(value, config.formLabel, column)
  }

  if (config.formTipoColumna == 'TimeField') {
    const formConfigObj = JSON.parse(config.formSobreescribeConfig);
    return validateTime(value, config.formLabel, formConfigObj.format, column)
  }

  if (config.formTipoColumna == 'DateField') {
    return validateDate(value, config.formLabel, column)
  }
  return false;
}

const validateNumber = (value: any, label: string, column: number): boolean|string => {
  if (typeof value === 'number' && !isNaN(value)) {
    return false;
  } else if (typeof value === 'string') {
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
      return false;
    } else {
      return `El valor en la columna ${column} (${label}) no es un número`;
    }
  } else {
    return `El valor en la columna ${column} (${label}) no es un número`;
  }
}

const validateCatalogo = (value: any, label: string, catalog: any[], column: number): boolean | string => {
  
  // Verifica que el valor sea un string
  if (typeof value !== 'string') {
      return `El valor en la columna ${column} (${label}) no es un string.`;
  }
  const found = catalog.find((item: any) => item.descripcion === value);
  if (found) {
      return false;
  }

  return `El valor en la columna ${column} (${label}) no esta dentro de los posibles valores permitidos.`;
};

const validateBoolean = (value: any, label: string, column: number): boolean|string => {
  console.log('value',value);
  if (typeof value === 'boolean') {
    return false;
  } else if (typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
      return false;
  } else {
      return `El valor en la columna ${column} (${label}) no es un true o false`;
  }
}

const validateTime = (value: any, label: string, format: string, column: number): boolean|string => {
  if (value instanceof Date) {
    return false;
  }

  if (typeof value !== 'string') {
    return `El valor en la columna ${column} (${label}) no es una cadena.`;
  }

  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

  if (timeRegex.test(value)) {
      return false;
  } else {
      return `El valor en la columna ${column} (${label}) no cumple con el formato de hora.`;
  }
}

const validateDate = (value: any, label: string, column: number): boolean|string => {
  if (value instanceof Date) {
    return false;
  } else if (typeof value === 'string') {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

      if (dateRegex.test(value)) {
          return false;
      } else {
          return `El valor en la columna ${column} (${label}) no cumple con el formato DD/MM/YYYY.`;
      }
  } else {
      return `El valor en la columna ${column} (${label}) no es una fecha válida.`;
  }
}

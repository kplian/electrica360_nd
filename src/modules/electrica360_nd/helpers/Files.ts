export function isExcelFile(fileObject: any): boolean|string {
    const validMime: string[] = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const validExcelExtensions: string[] = ['.xls', '.xlsx', '.xlsm'];
    const fileExtension: string = fileObject.name.slice(((fileObject.name.lastIndexOf(".") - 1) >>> 0) + 2);
    
    if (!validMime.includes(fileObject.mimetype)) {
        return false;
    }

    if (!validExcelExtensions.includes('.' + fileExtension.toLowerCase())) {
        return false;
    }
    return fileExtension;
  }
  
/**************************************************************************
 SYSTEM/MODULE  : PXPv2
 FILE           : Drive.ts
 DESCRIPTION    : mangage midle database conections
 ***************************************************************************
 ISSUE      DATE          AUTHOR        DESCRIPTION
 0        24/07/2022       RAC         File creation
 ***************************************************************************/
 
import { EntityManager, getConnection , getManager, In, IsNull } from 'typeorm';
import { XMLParser } from "fast-xml-parser";
class Driver {
    private connectionName: string;
    constructor(connectionName?: string) {
        this.connectionName = connectionName || 'default';
    }

    manageError (xmlString : string, overWriteError: boolean = false) {

        console.log('manageError manageError manageError manageError manageError manageError manageError ')
        console.log('manageError manageError manageError manageError manageError manageError manageError ')
        console.log('manageError manageError manageError manageError manageError manageError manageError ') 

        let xmlString3 = `<?xml version="1.0" encoding="UTF-8"?><TestScenario>${xmlString}</TestScenario>`;
        const parser = new XMLParser();
        let  json =   parser.parse(xmlString3.trim() );

        
        if(overWriteError ){
            console.log('overWriteError  -->', overWriteError)
            console.log('INICIA JSON ')
            console.log(json)
            console.log('TERMINA JSON ')
            return json;
        } else {
            console.log('overWriteError  -->', overWriteError)
            console.log('INICIA JSON ')
            console.log(json)
            console.log('TERMINA JSON ')
            return {
                success: false,
                response: json,
            }
        }


    }

    async callSEL( configRequest : any  ): Promise<unknown> {
        const dbErpConnection = getConnection(this.connectionName);
        try {
            let countResponse;
            let counter = 0;
            let swCounter = false;
            let data = [];
            console.log('JSON.stringify(configRequest)' , JSON.stringify(configRequest))

            //CON LOS SEL NECESITAMOS CORRER EL COUNT PREVIAMENTE
            if(configRequest.countTrasaction) {
                countResponse = await dbErpConnection.query(`select  f_midle_sel('${JSON.stringify({...configRequest, transaction: configRequest.countTrasaction } )}')`);
                swCounter = true;

                if(countResponse[0].f_midle_sel) {
                    if(countResponse[0].f_midle_sel.SQLERRM  ) {
                        //return this.manageError (countResponse[0].midle_sel.SQLERRM, !!configRequest.overWriteError);
                        return this.manageError (countResponse[0].f_midle_sel.SQLERRM);
                    }

                    if(countResponse.length > 0){
                        console.log('countResponse', countResponse[0].f_midle_sel)
                        counter = countResponse[0].f_midle_sel[0].count;
                        console.log('x' , counter , countResponse[0].f_midle_sel[0] )
                    }
                }
            }

            console.log("============================")
            console.log('counter' , counter, 'swCounter', swCounter)

            if(counter > 0 || !swCounter) {

                console.log('XXXXXXXXX')
                const query =  `select  f_midle_sel('${JSON.stringify(configRequest)}')`;
                console.log('QUERY -->' , query)
                const response = await dbErpConnection.query(query);

                console.log('response ===> ' , response)

                if(response[0].f_midle_sel) {

                    if(response[0].f_midle_sel.SQLERRM) {

                        console.log('ERROR EN LA TRASACCION ==================> ', response[0].f_midle_sel)
                         return this.manageError (response[0].f_midle_sel.SQLERRM , !!configRequest.overWriteError);

                    }  else {

                        if(swCounter){
                            return {
                                total: counter,
                                datos:  response[0].f_midle_sel
                            };
                        } else {
                            return  response[0].f_midle_sel ;
                        }

                    }

                } else {
                    console.log('ZZZZZZZZZ')
                    console.log(444)
                    console.log('RESULTADO VACIO NO HAY REGISTROS....pero el contador dice que si');


                    if(swCounter){
                        return {
                            total: counter,
                            datos:  []
                        };
                    } else {
                        return []
                    }

                }
            } else {

                return {
                    total: 0,
                    datos:  []
                };
            }

        } catch (e) {
            console.log(555)
            console.log('ERROR -----> ', e);
            return {
                success: false
            };
        }
    }


    async callCRUD(configRequest : any): Promise<unknown> {

        console.log('++++++++++++++++++++++++++++++++++++++')
        console.log('+++ callCRUD')
        console.log('+++++++++++++++++++++++++++++++++++++++')

        // listarAfiliadoOficina
        const dbErpConnection = getConnection(this.connectionName);
        try {

            const queryString = `select  f_midle_crud('${JSON.stringify(configRequest)}')`;

            console.log('queryString' , queryString);

             const response = await dbErpConnection.query(queryString);

             console.log('response' , response)

             if(response[0].f_midle_crud) {
                console.log(111)
                if(response[0].f_midle_crud.SQLERRM  ) {
                    console.log(2222)
                    let xmlString: string = response[0].f_midle_crud.SQLERRM;
                    let xmlString3 = `<?xml version="1.0" encoding="UTF-8"?><TestScenario>${xmlString}</TestScenario>`;
                    const parser = new XMLParser();
                    let  json =   parser.parse(xmlString3.trim() );
                    console.log(3333)

                    return {
                        success: false,
                        response: json,
                    }
                }  else {
                    console.log(4444 )
                    return {
                        success: true,
                        response:  response[0].f_midle_crud
                    };
                }

            } else {
                console.log(444)
                console.log('FALLA')
                return {
                    success: false
                }
            }
        } catch (e) {
            console.log(555)
            console.log('ERROR -----> ', e);
            return {
                success: false
            };
        }
    }



}

export default Driver;

/**************************************************************************
 SYSTEM/MODULE  : PXPv2
 FILE           : Response.ts
 DESCRIPTION    : format response before to send to view (tree format)
 ***************************************************************************
 ISSUE      DATE          AUTHOR        DESCRIPTION
 0        14/08/2022       RAC         File creation
 ***************************************************************************/

import { EntityManager, getConnection , getManager, In, IsNull } from 'typeorm';
const  xmlParser = require('xml2json');
class Response {

      configResp: any;


      nivel_arbol: any;
      datos: any;
      tipo_respuesta: string; //arbol o
      tipo: string; //EXITO o ERROR

      mensaje_tec : string;
      mensaje : string;
      archivo : string;
      archivo_generado: string;
      procedimiento: string;
      transaccion: string;
      capa: string;
      consulta: string;
      extraData: any;
      origen: string;

      constructor(respuesta : any, transaccion: any) {
          this.configResp = [];
          this.nivel_arbol = []
          this.datos = respuesta;
          this.transaccion = transaccion.transaction;

          this.tipo = (respuesta.TestScenario)?'ERROR':'EXITO';
          this.mensaje = (respuesta.TestScenario && respuesta.TestScenario.mensaje)? `${respuesta.TestScenario.mensaje}`:'';
          this.procedimiento = (respuesta.TestScenario && respuesta.TestScenario.procedimiento)? `${respuesta.TestScenario.procedimiento}`: transaccion.procedure;

          this.consulta = (respuesta.TestScenario && respuesta.TestScenario.consulta)? `${respuesta.TestScenario.consulta}`:'';
          this.mensaje_tec = (respuesta.TestScenario && respuesta.TestScenario.mensaje_tec)? `${respuesta.TestScenario.mensaje_tec}`:'';
          this.origen = (respuesta.TestScenario && respuesta.TestScenario.origen)? `${respuesta.TestScenario.origen}`:'';
          this.capa = (respuesta.TestScenario && respuesta.TestScenario.capa)? `${respuesta.TestScenario.capa}`:'';
          console.log('=================================')
          console.log('==== constructor', this.tipo )
          console.log('=================================')

          console.log('respuesta' , respuesta)


      }

      setTipoRespuesta(tipo_respuesta: string) {
         this.tipo_respuesta = tipo_respuesta;
      }

      addNivelArbol(campo_condicion: any,valor_condicion: any,arreglo_nivel: any,arreglo_equivalencias: any) {

          this.nivel_arbol.push({ 'campo': campo_condicion,
                                  'valor': valor_condicion,
                                  'id':'',
                                  'arreglo': arreglo_nivel,
                                  'arreglo_equivalencias': arreglo_equivalencias
                                 });

      }

    getDatos() {
        return this.datos
    }

    setDatos(datos: any) {
       this.datos = datos;
    }

    generarJson() {

        console.log("1. generarJson .......................................")
        if(this.tipo == 'EXITO') {
            console.log("1.A EXITO  .......................................")
            if(this.tipo_respuesta !='arbol') {
                console.log("2.A  NO ES ARBOL  .......................................")

                    let rootData: any = {}
                    if(  this.extraData   ){
                        rootData["data"] = this.extraData
                    }
                    rootData["data"] = this.datos
                    return rootData

            } else {
                console.log("2.B  ES ARBOL  .......................................")
                if(this.nivel_arbol.length == 0) {
                    this.mensaje_tec="Debe definirse por lo menos un nivel para la generacion del arbol";
                    this.mensaje="Error al generar el arbol";
                    this.archivo="Respose.ts";
                    console.log("2.C  sin niveles", this.mensaje_tec)
                    return this.generarMensajeJson();
                } else {
                    console.log("3 tiene niveles.")
                    let cont = 0;

                    this.datos.forEach((d: any, indexD: number) => {
                        console.log("4 for each datos")
                        console.log('CONTADOR    ', cont);
                        this.nivel_arbol.forEach((n: any, indexN: number) => {
                            //RAC 25/10/2011: validacion de varialbes
                            console.log("5 for each primer  nivelr arbol")
                            console.log('n[\'valor\'] && n[\'campo\']' , n['valor'] ,  n['campo'])
                            if(n['valor'] && n['campo']){

                                console.log('d[n[\'campo\']]' , d[n['campo']])

                                if(d[n['campo']]){

                                    console.log('***************************')
                                    console.log('** (d[n[\'campo\']]',d[n['campo']])
                                    console.log('***************************')


                                    if(d[n['campo']] == n['valor']) {
                                        this.datos[cont] = { ...this.datos[cont],...n['arreglo']};
                                        this.datos[cont] = this.crearCampos(this.datos[cont],n['arreglo_equivalencias']);
                                    }
                                }
                            }

                        });
                        cont++;
                    });


                    console.log('5. ...........', cont)
                    console.log('RESPUESTA...', this.datos)
                    return  this.datos;
                }

            }
        } else {
            console.log('copy logic from lib_general/Mensajge.php  to helpers/response.ts')
            return this.generarMensajeJson();

        }


    }

    generarMensajeJson() {

        console.log("************** generarMensajeJson ******************")

        let error = (this.tipo == 'EXITO')? false: true

        let root_array: any = {};
        let cuerpo_array: any = {};
        let detalle_array: any = {};

        detalle_array['mensaje'] = this.mensaje;

        if(this.archivo_generado){
            detalle_array['archivo_generado']= this.archivo_generado;
        }

        if(process.env._ESTADO_SISTEMA == 'desarrollo') {
            detalle_array['mensaje_tec'] = this.mensaje_tec;
            detalle_array['origen'] = this.archivo;
            detalle_array['procedimiento'] = this.procedimiento;
            detalle_array['transaccion'] = this.transaccion;
            detalle_array['capa'] = this.capa;
            detalle_array['consulta'] = this.consulta;
        }

        cuerpo_array['error'] = error;
        cuerpo_array['detalle'] = detalle_array;

        cuerpo_array['datos'] = this.datos; //datos a retornar
        root_array['ROOT'] = cuerpo_array;

        console.log(' root_array root_array root_array root_array root_array ')
        console.log(root_array)

        return root_array;
    }

    crearCampos(arreglo_poner: any,equivalencias: any) {
        let temp_var: any = '';
        let res: any = {...arreglo_poner};

        console.log('EQUIVALENCIAS' ,equivalencias )
        let aux: any = {};
        equivalencias.forEach((data: any, index: number) => {

            if(data['valor']) {
                let _name_aux: string = data['nombre']
                let _valor_aux: string = data['valor']
                aux[_name_aux]  = arreglo_poner[ _valor_aux ]

            } else {
                if(data['valores']) {
                    //TODO
                    console.log('copy logic from lib_general/Mensajge.php  to helpers/response.ts');
                }
            }
        });

        console.log('aux +++++> ', aux)
        console.log('{...res, ...aux}' , {...res, ...aux})
        res = {...res, ...aux}

        console.log('crearCampos' , res)
        return res;
    }





}

export default Response;

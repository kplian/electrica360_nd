/**************************************************************************
 SYSTEM/MODULE  : PXPv2
 FILE           : Parameter.ts
 DESCRIPTION    : common parameter utilities
 ***************************************************************************
 ISSUE      DATE          AUTHOR        DESCRIPTION
 0        24/07/2022       RAC         File creation base on CTParametro
 ***************************************************************************/

class Parameter {
    params: any;
    filter: any;
    configRequest: any;
    extraFilter: string;

    constructor(params: any, configRequest: any) {
        this.params = params;
        this.configRequest = configRequest;
        this.extraFilter = '';
    }

    obtenerParametroFiltro() {
        this.filter = this.params.filter;
    }

    addFiltro(criterio: string) {
        this.extraFilter = this.extraFilter + `  AND ${criterio}`;
    }

    aplicaFiltroRapido() {


        console.log('============================================')
        console.log('==== aplicaFiltroRapido' )
        console.log('============================================')

        if (this.params.bottom_filter_value != '' && this.params.bottom_filter_fields) {

            console.log('this.params.bottom_filter_value', this.params.bottom_filter_value)
            console.log('this.params.bottom_filter_fields' , this.params.bottom_filter_fields)

            let fields = [];
            fields = this.params.bottom_filter_fields.split(',');
            let value = this.params.bottom_filter_value;
            let query = ` ((${fields[0]}::varchar ILIKE ''%${value}%'')`;
            query = ` ${query} OR to_tsvector(${fields[0]}::varchar) @@ plainto_tsquery(''spanish'',''${value}''))`;

            for (let i=1 ; i < fields.length; i++) {
                query = ` ${query} OR ((${fields[i]}::varchar ILIKE ''%${value}%'')`;
                query = ` ${query} OR to_tsvector(${fields[i]}::varchar) @@ plainto_tsquery(''spanish'',''${value}''))`;
            }
            console.log(' ADD  FILTRO RAPIDO')
            this.addFiltro(`(${query})`);
        } else  {

            console.log('  NO FILTRO RAPIDO')
        }
    }

    armarFiltro(filter: any,  tipo : string = 'JSON', pFilter: string  = ''): string {
        let where : string = " 0 = 0 ";
        let qs = '';
        console.log('tipo =====>' , tipo)
        if(tipo == 'JSON') { //decodifica filtro JSON usado en grillas


            //decodifica filtro JSON usado en grillas
            if(filter) { //#43 NUEVO
                console.log('filter ----> ', filter)

                for (let  i = 0; i < filter.length; i++) {
                    switch(filter[i]['type']) {

                        //RAC  26/10/11 Combina el filtro con like y tc_vector  -> si es muy lento deveremos escoger cual usamos
                        //case 'string' : $qs .= " AND ".$filter[$i]['field']." ILIKE ''%".$filter[$i]['value']."%''"; Break;
                        //case 'string' : $qs .= " AND to_tsvector(".$filter[$i]['field'].") @@ plainto_tsquery(''spanish'',''".$filter[$i]['value']."'')"; Break;
                        case 'string' :

                            let paramfiltro = filter[i]['field'].split('#');


                            let filteraux =  filter[i]['field'].trim();
                            let contador = paramfiltro.length;
                            qs = ` ${qs} AND ( 1=0 `;

                            if(filteraux != ''){
                                for(let k = 0; k < contador; k++) {

                                    qs = ` ${qs} OR ((${paramfiltro[k]}::varchar ILIKE ''%${filter[i]['value']}%'')`;
                                    qs = ` ${qs} OR( to_tsvector(${paramfiltro[k]}::varchar) @@ plainto_tsquery(''spanish'',''${filter[i]['value']}'')))`;

                                }
                            }
                            qs = ` ${qs})`;

                            break;

                        case 'list' :
                            let fi = [];
                            let fi_cadena : string;
                            if (filter[i]['value'].length >1) {
                                for (let q=0; q < filter[i]['value'].length; q++) {
                                    fi[q] = `''${filter[i]['value'][q]}''`;
                                }
                                fi_cadena = fi.join(',');
                                qs = ` ${qs} AND ${filter[i]['field']} IN (${fi_cadena})`;
                            }else{
                                qs = ` ${qs} AND ${filter[i]['field']} = ''${filter[i]['value'][0]}''`;
                            }
                            break;
                        case 'boolean' :
                            qs = ` ${qs} AND ${filter[i]['field']} = ${filter[i]['value']}`;
                            break;
                        case 'numeric' :
                            switch (filter[i]['comparison']) {
                                case 'ne' : qs = ` ${qs} AND ${filter[i]['field']} != ${filter[i]['value']}`; break;
                                case 'eq' : qs = ` ${qs} AND ${filter[i]['field']} =  ${filter[i]['value']}`; break;
                                case 'lt' : qs = ` ${qs} AND ${filter[i]['field']} <  ${filter[i]['value']}`; break;
                                case 'gt' : qs = ` ${qs} AND ${filter[i]['field']} >  ${filter[i]['value']}`; break;
                            }
                            break;
                        case 'date' :
                            switch (filter[i]['comparison']) {
                                case 'ne' : qs = ` ${qs}  AND ${filter[i]['field']} != to_timestamp(${Date.parse(filter[i]['value'])}/1000)::date`; break;
                                case 'eq' : qs = ` ${qs}  AND ${filter[i]['field']} = to_timestamp(${Date.parse(filter[i]['value'])}/1000)::date`; break;
                                case 'lt' : qs = ` ${qs}  AND ${filter[i]['field']} < to_timestamp(${Date.parse(filter[i]['value'])}/1000)::date`; break;
                                case 'gt' : qs = ` ${qs}  AND ${filter[i]['field']} > to_timestamp(${Date.parse(filter[i]['value'])}/1000)::date`; break;
                            }
                            break;
                    }
                }
            }
            where = ` ${where} ${qs}`;  //*/


        } else { //decodifica filtro clasico utilizado en combos
            let paramfiltro = pFilter.split('#');
            qs = '';
            filter = filter.trim();
            let contador = paramfiltro.length;

            if(filter!='') {
                for(let i=0; i < contador; i++){
                    if(i == 0){
                        qs = `${qs}  AND ( (lower(${paramfiltro[i]}::varchar) LIKE lower(''%${filter}%'')) `;
                    }
                    else{
                        qs =` ${qs} OR  (lower(${paramfiltro[i]}::varchar) LIKE lower(''%${filter}%'')) `;
                    }
                    if( i == contador - 1) {
                        qs = `${qs})`;
                    }
                }
            }
            where = `${where} ${qs}`;
        }
        //add extra params and return the final filter
        return `${where} ${this.extraFilter}`;
    }

    getObj(): any {

        console.log("===============================================")
        console.log("=== getObj")
        console.log("===============================================")

        let  filtro: string = ' 0=0 ';

        console.log('this.params.query' ,this.params.query)

        this.aplicaFiltroRapido();

        console.log('this.params.query' , this.params.query)

        if(this.params.query) {
            console.log('CLASICO')
            filtro = this.armarFiltro(this.params.query,'CLASICO', this.params.par_filtro);
        } else {
            console.log('NO CLASICO .......................................')
            console.log('this.params.filter',this.params.filter)
            if(this.params.filter) {
                filtro = this.armarFiltro(JSON.parse(this.params.filter));
            }
        }

        console.log('FILTRO ====> ' , filtro);

        console.log('ANTES  this.configRequest.createParameters' ,  this.configRequest.createParameters)

        const createParameters = [
                { name: '_nombre_usuario_ai', value: 'test', type: 'varchar' },
                { name: '_id_usuario_ai', value: 0, type: 'int4' },
                { name: 'puntero', value: this.params.startc || 0, type: 'int4' },
                { name: 'ordenacion', value: this.params.sort || this.configRequest.ordenacionDefault ||'', type: 'varchar' },
                { name: 'dir_ordenacion', value: this.params.dir || this.configRequest.dirOrdenacionDefault  ||'', type: 'varchar' },
                { name: 'cantidad', value: this.params.limit || 100, type: 'int4' },
                { name: 'filtro', value: filtro, type: 'varchar' },
                { name: 'id_subsistema', value: this.params.id_subsistema || '', type: 'int4' },
                { name: 'codigo_subsistema', value: this.params.codigo_subsistema , type: 'varchar' },
                { name: 'tipo_filtro', value: this.params.tipo_filtro ||' null', type: 'varchar' }
         ]

        this.configRequest.createParameters = [...createParameters, ...this.configRequest.createParameters ]


        console.log('DESPUES  this.configRequest.createParameters' ,  this.configRequest.createParameters)



        return  this.configRequest
    }

}

export default Parameter;

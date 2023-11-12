import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import Tabla from './Tabla';

@Entity({ name: 'ttipo_columna', schema: 'wf' })
export default class TipoColumna extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_tipo_columna' })
  idTipoColumna: number;

  @Column({ name: 'id_tabla', type: 'int', nullable: false })
  idTabla: number;

  @Column({ name: 'bd_nombre_columna', type: 'varchar', length: 100, nullable: false })
  bdNombreColumna: string;

  @Column({ name: 'bd_tipo_columna', type: 'varchar', length: 100, nullable: false })
  bdTipoColumna: string;

  @Column({ name: 'bd_descripcion_columna', type: 'text', nullable: true })
  bdDescripcionColumna: string | null;

  @Column({ name: 'bd_tamano_columna', type: 'varchar', length: 5, nullable: true })
  bdTamanoColumna: string | null;

  @Column({ name: 'bd_campos_adicionales', type: 'text', nullable: true })
  bdCamposAdicionales: string | null;

  @Column({ name: 'bd_joins_adicionales', type: 'text', nullable: true })
  bdJoinsAdicionales: string | null;

  @Column({ name: 'bd_formula_calculo', type: 'text', nullable: true })
  bdFormulaCalculo: string | null;

  @Column({ name: 'grid_sobreescribe_filtro', type: 'text', nullable: true })
  gridSobreescribeFiltro: string | null;

  @Column({ name: 'grid_campos_adicionales', type: 'text', nullable: true })
  gridCamposAdicionales: string | null;

  @Column({ name: 'form_tipo_columna', type: 'varchar', length: 100, nullable: false })
  formTipoColumna: string;

  @Column({ name: 'form_label', type: 'varchar', length: 100, nullable: true })
  formLabel: string | null;

  @Column({ name: 'form_es_combo', type: 'varchar', length: 2, nullable: true })
  formEsCombo: string | null;

  @Column({ name: 'form_combo_rec', type: 'varchar', length: 50, nullable: true })
  formComboRec: string | null;

  @Column({ name: 'form_sobreescribe_config', type: 'text', nullable: true })
  formSobreescribeConfig: string | null;

  @Column({ name: 'ejecutado', type: 'varchar', length: 2, nullable: false, default: 'no' })
  ejecutado: string;

  @Column({ name: 'modificado', type: 'int', nullable: true })
  modificado: number | null;

  @Column({ name: 'bd_prioridad', type: 'int', nullable: true })
  bdPrioridad: number | null;

  @Column({ name: 'form_grupo', type: 'int', nullable: true })
  formGrupo: number | null;

  @Column({ name: 'bd_campos_subconsulta', type: 'text', nullable: true })
  bdCamposSubconsulta: string | null;

  @Column({ name: 'transacciones_permiso', type: 'varchar', length: 250, nullable: true })
  transaccionesPermiso: string | null;

  @Column({ name: 'orden', type: 'int', nullable: true })
  orden: number | null;

  @ManyToOne(() => Tabla, tabla => tabla.columnas)
  @JoinColumn({ name: 'id_tabla' })
  tabla: Tabla;
}

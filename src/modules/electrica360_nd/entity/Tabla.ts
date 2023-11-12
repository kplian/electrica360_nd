import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import TipoFormulario from './TipoFormulario';
import TipoColumna from './TipoColumna';


@Entity({ name: 'ttabla', schema: 'wf' })
export default class Tabla extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_tabla' })
  idTabla: number;

  @Column({ name: 'id_tipo_proceso', type: 'int', nullable: false })
  idTipoProceso: number;

  @Column({ name: 'bd_nombre_tabla', type: 'varchar', length: 100, nullable: false })
  bdNombreTabla: string;

  @Column({ name: 'bd_codigo_tabla', type: 'varchar', length: 25, nullable: false })
  bdCodigoTabla: string;

  @Column({ name: 'bd_descripcion', type: 'text', nullable: true })
  bdDescripcion: string | null;

  @Column({ name: 'bd_scripts_extras', type: 'text', nullable: true })
  bdScriptsExtras: string | null;

  @Column({ name: 'vista_tipo', type: 'varchar', length: 30, nullable: false })
  vistaTipo: string;

  @Column({ name: 'vista_posicion', type: 'varchar', length: 50, nullable: true })
  vistaPosicion: string | null;

  @Column({ name: 'vista_id_tabla_maestro', type: 'int', nullable: true })
  vistaIdTablaMaestro: number | null;

  @Column({ name: 'vista_campo_ordenacion', type: 'varchar', length: 100, nullable: true })
  vistaCampoOrdenacion: string | null;

  @Column({ name: 'vista_dir_ordenacion', type: 'varchar', length: 4, nullable: true })
  vistaDirOrdenacion: string | null;

  @Column({ name: 'vista_campo_maestro', type: 'varchar', length: 75, nullable: true })
  vistaCampoMaestro: string | null;

  @Column({ name: 'vista_scripts_extras', type: 'text', nullable: true })
  vistaScriptsExtras: string | null;

  @Column({ name: 'menu_nombre', type: 'varchar', length: 100, nullable: true })
  menuNombre: string | null;

  @Column({ name: 'menu_icono', type: 'varchar', length: 100, nullable: true })
  menuIcono: string | null;

  @Column({ name: 'menu_codigo', type: 'varchar', length: 25, nullable: true })
  menuCodigo: string | null;

  @Column({ name: 'ejecutado', type: 'varchar', length: 2, nullable: false, default: 'no' })
  ejecutado: string;

  @Column({ name: 'script_ejecutado', type: 'varchar', length: 2, nullable: false, default: 'no' })
  scriptEjecutado: string;

  @Column({ name: 'vista_estados_new', type: 'varchar', nullable: true })
  vistaEstadosNew: string | null;

  @Column({ name: 'vista_estados_delete', type: 'varchar', nullable: true })
  vistaEstadosDelete: string | null;

  @Column({ name: 'modificado', type: 'int', nullable: true })
  modificado: number | null;

  @OneToMany(() => TipoFormulario, tipoFormulario => tipoFormulario.tabla)
  tipoFormularios: TipoFormulario[];

  @OneToMany(() => TipoColumna, tipoColumna => tipoColumna.tabla)
  columnas: TipoColumna[];

}

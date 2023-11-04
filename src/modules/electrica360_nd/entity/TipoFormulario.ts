import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import Tabla from './Tabla';

@Entity({ name: 'ttipo_formulario', schema: 'ele' })
export default class TipoFormulario extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_tipo_formulario' })
  idTipoFormulario: number;

  @Column({ name: 'codigo', type: 'varchar', length: 50, nullable: false })
  codigo: string;

  @Column({ name: 'descripcion', type: 'text', nullable: false })
  descripcion: string;

  @Column({ name: 'fecha_ini', type: 'date', nullable: false })
  fechaIni: Date;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin: Date | null;

  @Column({ name: 'id_tipo_formulario_previo', type: 'int', nullable: true })
  idTipoFormularioPrevio: number | null;

  @Column({ name: 'plazo', type: 'varchar', length: 20, nullable: false })
  plazo: string;

  @Column({ name: 'id_tipo_proceso', type: 'int', nullable: false })
  idTipoProceso: number;

  @Column({ name: 'version', type: 'int', nullable: false, default: 0 })
  version: number;

  @Column({ name: 'id_tabla', type: 'int', nullable: true })
  idTabla: number | null;

  @Column({ name: 'fecha_ini_ap', type: 'date', nullable: true })
  fechaIniAp: Date | null;

  @Column({ name: 'fecha_fin_ap', type: 'date', nullable: true })
  fechaFinAp: Date | null;

  @Column({ name: 'funcion_validacion', type: 'varchar', length: 500, nullable: true })
  funcionValidacion: string | null;

  @ManyToOne(() => Tabla, tabla => tabla.tipoFormularios)
  @JoinColumn({ name: 'id_tabla' })
  tabla: Tabla;

}

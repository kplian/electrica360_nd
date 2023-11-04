import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import Ciae from './Ciae';

@Entity({ name: 'tformulario', schema: 'ele' })
export default class Formulario extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_formulario' })
  idFormulario: number;

  @Column({ name: 'id_estado_wf', type: 'int', nullable: false })
  idEstadoWf: number;

  @Column({ name: 'id_proceso_wf', type: 'int', nullable: false })
  idProcesoWf: number;

  @Column({ name: 'estado', type: 'varchar', length: 50, nullable: false })
  estado: string;

  @Column({ name: 'id_ciae', type: 'int', nullable: true })
  idCiae: number | null;

  @Column({ name: 'fecha_aprobacion', type: 'date', nullable: true })
  fechaAprobacion: Date | null;

  @Column({ name: 'fecha_limite', type: 'date', nullable: true })
  fechaLimite: Date | null;

  @Column({ name: 'id_usuario_aprobador', type: 'int', nullable: true })
  idUsuarioAprobador: number | null;

  @Column({ name: 'id_tipo_formulario', type: 'int', nullable: true })
  idTipoFormulario: number | null;

  @Column({ name: 'anio', type: 'int', nullable: true })
  anio: number | null;

  @Column({ name: 'mes', type: 'numeric', nullable: true })
  mes: number | null;

  @Column({ name: 'semestre', type: 'int', nullable: true })
  semestre: number | null;

  @Column({ name: 'trimestre', type: 'int', nullable: true })
  trimestre: number | null;

  @Column({ name: 'num_tramite', type: 'varchar', length: 200, nullable: true })
  numTramite: string | null;

  @Column({ name: 'id_funcionario_resp', type: 'int', nullable: true })
  idFuncionarioResp: number | null;

  @Column({ name: 'id_funcionario_apro', type: 'int', nullable: true })
  idFuncionarioApro: number | null;

  @Column({ name: 'id_depto', type: 'int', nullable: true })
  idDepto: number | null;

  @Column({ name: 'fecha_envio', type: 'timestamp', nullable: true })
  fechaEnvio: Date | null;

  @ManyToOne(() => Ciae, ciae => ciae.formularios)
  @JoinColumn({ name: 'id_ciae' })
  ciae: Ciae;

  
}

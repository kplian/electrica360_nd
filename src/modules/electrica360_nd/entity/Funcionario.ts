import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, BaseEntity } from 'typeorm';
import Persona from './Persona';
import FuncionarioEmpresa from './FuncionarioEmpresa';

@Entity({ name: 'tfuncionario', schema: 'orga' })
export default class Funcionario extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_funcionario' })
  id: number;

  @Column({ name: 'id_persona', type: 'int', nullable: false })
  idPersona: number;

  @Column({ name: 'id_usuario_reg', type: 'int', nullable: false })
  idUsuarioReg: number;

  @OneToOne(() => Persona)
  @JoinColumn({ name: 'id_persona' })
  persona: Persona;

  @Column({ name: 'codigo', type: 'varchar', length: 20, nullable: true })
  codigo: string;

  @Column({ name: 'email_empresa', type: 'varchar', length: 150, nullable: true })
  emailEmpresa: string;

  @Column({ name: 'interno', type: 'varchar', length: 9, nullable: true })
  interno: string;

  @Column({ name: 'estado_reg', type: 'varchar', length: 20, nullable: false })
  estadoReg: string;

  @Column({ name: 'fecha_ingreso', type: 'date', nullable: false })
  fechaIngreso: Date;

  @Column({ name: 'fecha_reg', type: 'date', nullable: false })
  fechaReg: Date;

  @Column({ name: 'telefono_ofi', type: 'varchar', length: 50, nullable: true })
  telefonoOfi: string;

  @Column({ name: 'antiguedad_anterior', type: 'int', nullable: true })
  antiguedadAnterior: number;

  @Column({ name: 'id_biometrico', type: 'int', nullable: true })
  biometricoId: number;

  @Column({ name: 'id_auxiliar', type: 'int', nullable: true })
  auxiliarId: number;

  @Column({ name: 'codigo_rciva', type: 'varchar', length: 200, nullable: true })
  codigoRciva: string;

  @Column({ name: 'monto_rciva_anterior', type: 'numeric', precision: 10, scale: 2, nullable: false, default: 0 })
  montoRcivaAnterior: number;

  @Column({ name: 'profesion', type: 'varchar', length: 500, nullable: true })
  profesion: string;

  @Column({ name: 'fecha_quinquenio', type: 'date', nullable: true })
  fechaQuinquenio: Date;

  @OneToMany(() => FuncionarioEmpresa, funcionarioEmpresa => funcionarioEmpresa.funcionario)
  funcionarioEmpresa: FuncionarioEmpresa[];

}

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import FuncionarioCiae from './FuncionarioCiae';
import Formulario from './Formulario';

@Entity({ name: 'tciae', schema: 'ele' })
export default class Ciae extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_ciae' })
  id: number;

  @Column({ name: 'codigo_ciae', type: 'varchar', length: 100, nullable: false })
  codigoCiae: string;

  @Column({ name: 'codigo_empresa', type: 'varchar', length: 100, nullable: false })
  codigoEmpresa: string;

  @Column({ name: 'codigo_actividad', type: 'varchar', length: 100, nullable: false })
  codigoActividad: string;

  @Column({ name: 'codigo_titulo', type: 'varchar', nullable: false })
  codigoTitulo: string;

  @Column({ name: 'codigo_sistema', type: 'varchar', nullable: false })
  codigoSistema: string;

  @Column({ name: 'fecha_reg', type: 'date', nullable: true })
  fechaReg: Date;

  @Column({ name: 'estado_reg', type: 'varchar', length: 50, nullable: false, default: 'activo' })
  estadoReg: string;

  @Column({ name: 'id_usuario_reg', type: 'int', nullable: false })
  idUsuarioReg: number;

  @OneToMany(() => FuncionarioCiae, funcionarioCiae => funcionarioCiae.ciae)
  funcionarioCiae: FuncionarioCiae[];

  @OneToMany(() => Formulario, formulario => formulario.ciae)
  formularios: Formulario[];
}

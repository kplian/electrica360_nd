import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import Ciae from './Ciae';

@Entity({ name: 'tfuncionario_ciae', schema: 'ele' })
export default class FuncionarioCiae extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_funcionario_ciae' })
  id: number;

  @Column({ name: 'id_funcionario_empresa', type: 'int', nullable: false })
  idFuncionarioEmpresa: number;

  @Column({ name: 'id_ciae', type: 'int', nullable: false })
  idCiae: number;

  @Column({ name: 'fecha_reg', type: 'date', nullable: true })
  fechaReg: Date;

  @Column({ name: 'estado_reg', type: 'varchar', length: 50, nullable: false, default: 'activo' })
  estadoReg: string;

  @Column({ name: 'id_usuario_reg', type: 'int', nullable: false })
  idUsuarioReg: number;

  @ManyToOne(() => Ciae, ciae => ciae.funcionarioCiae)
  @JoinColumn({ name: 'id_ciae' })
  ciae: Ciae;
}

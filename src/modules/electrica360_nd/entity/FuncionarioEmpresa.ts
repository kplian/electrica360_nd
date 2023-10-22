import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'typeorm';
import EmpresaAetn from './EmpresaAetn';
import Funcionario from './Funcionario';
import Usuario from './Usuario';

@Entity({ name: 'tfuncionario_empresa', schema: 'ele' })
export default class FuncionarioEmpresa extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_funcionario_empresa' })
  id: number;

  @Column({ name: 'cargo', type: 'varchar', length: 300 })
  cargo: string;

  @Column({ name: 'id_empresa_aetn', type: 'int' })
  empresaAetnId: number;

  @ManyToOne(() => EmpresaAetn, empresaAetn => empresaAetn.funcionarioEmpresa)
  @JoinColumn({ name: 'id_empresa_aetn' })
  empresaAetn: EmpresaAetn;

  @Column({ name: 'id_usuario', type: 'int' })
  idUsuario: number;

  @Column({ name: 'estado_reg', type: 'varchar', length: 100 })
  estadoReg: string;

  @Column({ name: 'id_funcionario', type: 'int' })
  funcionarioId: number;

  @Column({ name: 'fecha_reg', type: 'date', nullable: false })
  fechaReg: Date;

  @Column({ name: 'id_usuario_reg', type: 'int', nullable: false })
  idUsuarioReg: number;

  @ManyToOne(() => Funcionario, funcionario => funcionario.funcionarioEmpresa)
  @JoinColumn({ name: 'id_funcionario' })
  funcionario: Funcionario;

  @ManyToOne(() => Usuario, usuario => usuario.funcionarioEmpresa)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}

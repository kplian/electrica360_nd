import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'typeorm';
import FuncionarioEmpresa from './FuncionarioEmpresa';

@Entity({ name: 'tempresa_aetn', schema: 'ele' })
export default class EmpresaAetn extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_empresa_aetn' })
  id: number;

  @Column({ name: 'codigo', type: 'varchar', length: 100 })
  codigo: string;

  @Column({ name: 'nombre', type: 'varchar', length: 300 })
  nombre: string;

  @Column({ name: 'sigla', type: 'varchar', length: 30, nullable: true })
  sigla: string;

  @OneToMany(() => FuncionarioEmpresa, funcionarioEmpresa => funcionarioEmpresa.empresaAetn)
  funcionarioEmpresa: FuncionarioEmpresa[];
}

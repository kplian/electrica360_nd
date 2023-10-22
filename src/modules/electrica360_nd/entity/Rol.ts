import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity } from 'typeorm';
import UsuarioRol from './UsuarioRol';

@Entity({ name: 'trol' , schema: 'segu' })
export default class Rol extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  id: number;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'fecha_reg', type: 'date', nullable: false, default: () => 'now()' })
  fechaRegistro: Date;

  @Column({ name: 'estado_reg', type: 'varchar', length: 50, nullable: false, default: 'activo' })
  estadoRegistro: string;

  @Column({ name: 'rol', type: 'varchar', length: 150, nullable: false })
  nombre: string;

  @Column({ name: 'id_subsistema', type: 'int', nullable: true })
  idSubsistema: number;

  @Column({ name: 'modificado', type: 'int', nullable: true })
  modificado: number;

  @Column({ name: 'bandera', type: 'varchar', length: 100, nullable: false, default: 'N' })
  bandera: string;

  @OneToMany(() => UsuarioRol, usuarioRol => usuarioRol.rol)
  usuarioRoles: UsuarioRol[];
}

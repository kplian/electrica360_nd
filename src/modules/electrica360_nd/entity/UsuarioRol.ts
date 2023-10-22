import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity,JoinColumn } from 'typeorm';
import Rol from './Rol';
import Usuario from './Usuario';

@Entity({ name: 'tusuario_rol', schema: 'segu'  })
export default class UsuarioRol extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_usuario_rol' })
  id: number;

  @Column({ name: 'id_rol', type: 'int', nullable: false })
  idRol: number;

  @Column({ name: 'id_usuario', type: 'int', nullable: false })
  idUsuario: number;

  @Column({ name: 'fecha_reg', type: 'date', nullable: true })
  fechaReg: Date;

  @Column({ name: 'estado_reg', type: 'varchar', length: 50, nullable: false, default: 'activo' })
  estadoReg: string;

  @ManyToOne(() => Rol, rol => rol.usuarioRoles)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @ManyToOne(() => Usuario, usuario => usuario.usuarioRoles)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}

import {
    OneToMany,
    JoinColumn,
    ManyToOne,
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column, AfterLoad,
    OneToOne,
} from 'typeorm';

import Persona from './Persona';
import FuncionarioEmpresa from './FuncionarioEmpresa';
import UsuarioRol from './UsuarioRol';

@Entity({ name: 'tusuario', schema: 'segu' })
export default class User extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'id_usuario' })
    userId: number;

    @Column({ name: 'cuenta', type: 'varchar', length: 100 })
    username: string;

    @Column({ name: 'contrasena', type: 'varchar', length: 100, nullable: true })
    password?: string;

    @Column({ name: 'contrasena_anterior', type: 'varchar', length: 100, nullable: true })
    contrasenaAnterior?: string;

    @Column({ name: 'fecha_caducidad', nullable: true })
    expiration?: Date;

    @Column({ name: 'id_persona' })
    idPersona: number;

    @Column({ name: 'id_clasificador' })
    idClasificador: number;

    @Column({ name: 'autentificacion', type: 'varchar', length: 20 })
    autentificacion: string;

    @Column({ name: 'estado_reg', type: 'varchar', length: 100 })
    status: string;

    @Column({ name: 'estilo', type: 'varchar', length: 100 })
    estilo: string;

    @OneToOne(() => Persona)
    @JoinColumn({ name: 'id_persona' })
    persona: Persona;

    @OneToMany(() => FuncionarioEmpresa, funcionarioEmpresa => funcionarioEmpresa.usuario)
    funcionarioEmpresa: FuncionarioEmpresa[];

    @OneToMany(() => UsuarioRol, usuarioRol => usuarioRol.usuario)
    usuarioRoles: UsuarioRol[]; 


}

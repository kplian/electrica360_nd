import {
    OneToMany,
    JoinColumn,
    ManyToOne,
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column, AfterLoad
} from 'typeorm';

@Entity({ name: 'tusuario', schema: 'segu' })
export default class User extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'id_usuario' })
    userId: number;

    @Column({ name: 'cuenta', type: 'varchar', length: 100 })
    username: string;

    @Column({ name: 'contrasena', type: 'varchar', length: 100, nullable: true })
    password?: string;

    @Column({ name: 'fecha_caducidad', nullable: true })
    expiration?: Date;

    @Column({ name: 'id_persona' })
    idPersona: number;

    @Column({ name: 'estado_reg', type: 'varchar', length: 20 })
    estadoReg: string;

    @Column({ name: 'autentificacion', type: 'varchar', length: 20 })
    autentificacion: string;

}

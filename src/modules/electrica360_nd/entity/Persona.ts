import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from 'typeorm';
import Funcionario from './Funcionario';
import Usuario from './Usuario';

@Entity({ name: 'tpersona', schema: 'segu' })
export default class Persona extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_persona' })
  id: number;

  @Column({ name: 'nombre', type: 'varchar', length: 150, nullable: true })
  nombre: string;

  @Column({ name: 'apellido_paterno', type: 'varchar', length: 100, nullable: true })
  apellidoPaterno: string;

  @Column({ name: 'apellido_materno', type: 'varchar', length: 100, nullable: true })
  apellidoMaterno: string;

  @Column({ name: 'ci', type: 'varchar', length: 20, nullable: true })
  ci: string;

  @Column({ name: 'correo', type: 'varchar', length: 50, nullable: true })
  correo: string;

  @Column({ name: 'celular1', type: 'varchar', length: 15, nullable: true })
  celular1: string;

  @Column({ name: 'num_documento', type: 'int', nullable: true })
  numDocumento: number;

  @Column({ name: 'telefono1', type: 'varchar', length: 20, nullable: true })
  telefono1: string;

  @Column({ name: 'telefono2', type: 'varchar', length: 20, nullable: true })
  telefono2: string;

  @Column({ name: 'celular2', type: 'varchar', length: 15, nullable: true })
  celular2: string;

  @Column({ name: 'foto', type: 'bytea', nullable: true })
  foto: Buffer;

  @Column({ name: 'extension', type: 'varchar', length: 100, nullable: true })
  extension: string;

  @Column({ name: 'genero', type: 'varchar', length: 15, nullable: true })
  genero: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ name: 'direccion', type: 'varchar', nullable: true })
  direccion: string;

  @Column({ name: 'correo2', type: 'varchar', length: 40, nullable: true })
  correo2: string;

  @Column({ name: 'id_tipo_doc_identificacion', type: 'int', nullable: true })
  tipoDocIdentificacionId: number;

  @Column({ name: 'nacionalidad', type: 'varchar', length: 100, nullable: true })
  nacionalidad: string;

  @Column({ name: 'expedicion', type: 'varchar', length: 100, nullable: true })
  expedicion: string;

  @Column({ name: 'discapacitado', type: 'varchar', length: 2, nullable: true })
  discapacitado: string;

  @Column({ name: 'tipo_documento', type: 'varchar', length: 100, nullable: true })
  tipoDocumento: string;

  @Column({ name: 'estado_civil', type: 'varchar', length: 100, nullable: true })
  estadoCivil: string;

  @Column({ name: 'carnet_discapacitado', type: 'varchar', length: 100, nullable: true })
  carnetDiscapacitado: string;

  @Column({ name: 'id_lugar', type: 'int', nullable: true })
  lugarId: number;

  @Column({ name: 'matricula', type: 'varchar', length: 20, nullable: true })
  matricula: string;

  @Column({ name: 'historia_clinica', type: 'varchar', length: 20, nullable: true })
  historiaClinica: string;

  @Column({ name: 'grupo_sanguineo', type: 'varchar', length: 10, nullable: true })
  grupoSanguineo: string;

  @Column({ name: 'abreviatura_titulo', type: 'varchar', length: 5, default: 'Sr.' })
  abreviaturaTitulo: string;

  @Column({ name: 'profesion', type: 'varchar', length: 50, nullable: true })
  profesion: string;

  @Column({ name: 'nombre_archivo_foto', type: 'text', default: '' })
  nombreArchivoFoto: string;

  @Column({ name: 'sobrenombre', type: 'varchar', length: 50, default: '' })
  sobrenombre: string;

  @Column({ name: 'cualidad_1', type: 'varchar', length: 50, default: '' })
  cualidad1: string;

  @Column({ name: 'cualidad_2', type: 'varchar', length: 50, default: '' })
  cualidad2: string;

  @Column({ name: 'id_usuario_reg', type: 'int', nullable: false })
  idUsuarioReg: number;

}

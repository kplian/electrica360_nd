
import moment from 'moment';
import crypto from 'crypto';
import { EntityManager, getManager } from 'typeorm';
import {
    Controller, Log, Post, ReadOnly, Get, Permission, PxpError
} from '@pxp-nd/core';

import FuncionarioEmpresaModel from '../entity/FuncionarioEmpresa';
import FuncionarioModel from '../entity/Funcionario';
import UsuarioModel from '../entity/Usuario';
import UsuarioRolModel from '../entity/UsuarioRol';
import PersonaModel from '../entity/Persona';
import RolModel from '../entity/Rol';
import FuncionarioCiaeModel from '../entity/FuncionarioCiae';
import CiaeModel from '../entity/Ciae';


class FuncionarioEmpresa extends Controller {

    @Get()
    @ReadOnly(true)
    @Log(true)
    //@Permission(true)
    async  lista(params: Record<string, unknown>): Promise<any> {
        const funcionarioEmpresa = await FuncionarioEmpresaModel.findOne({
            where: { idUsuario: this.user.userId, estadoReg: 'activo' },
        });

        if (!funcionarioEmpresa) {
            throw new PxpError(400, 'El usuario no esta asignado a la empresa');
        }

        const queryBuilder = getManager()
            .createQueryBuilder()
            .select('funcionarioEmpresa.id', 'idFuncionarioEmpresa')
            .addSelect('funcionarioEmpresa.funcionarioId', 'idFuncionario')
            .addSelect('funcionarioEmpresa.idUsuario', 'idUsuario')
            .addSelect('usuario.idPersona', 'idPersona')
            .addSelect('persona.nombre', 'nombre')
            .addSelect('persona.apellidoPaterno', 'apellidoPaterno')
            .addSelect('persona.apellidoMaterno', 'apellidoMaterno')
            .addSelect('persona.correo', 'correo')
            .addSelect('persona.telefono1', 'telefono')
            .addSelect('persona.genero', 'genero')
            .addSelect('usuario.username', 'username')
            .addSelect('usuario.expiration', 'fechaCaducidad')
            .addSelect('funcionarioEmpresa.cargo', 'cargo')
            .from(FuncionarioEmpresaModel, 'funcionarioEmpresa')
            .innerJoin(UsuarioModel, 'usuario', 'funcionarioEmpresa.idUsuario = usuario.userId')
            .innerJoin(PersonaModel, 'persona', 'usuario.idPersona = persona.id')
            .where('funcionarioEmpresa.empresaAetnId = :empresaAetnId', { empresaAetnId: funcionarioEmpresa.empresaAetnId })
            .andWhere("funcionarioEmpresa.estadoReg = 'activo'");

        

        const funcionariosEmpresa = await queryBuilder.getRawMany();

        for (const funcionarioEmpresa of funcionariosEmpresa) {
            const queryBuilder1 = getManager()
            .createQueryBuilder()
            .select('rol.id', 'id')
            .addSelect('rol.nombre', 'name')
            .from(UsuarioRolModel, 'usuarioRol')
            .innerJoin(RolModel, 'rol', 'usuarioRol.idRol = rol.id')
            .where('usuarioRol.idUsuario = :idUsuario', { idUsuario: funcionarioEmpresa.idUsuario })
            .andWhere("usuarioRol.estadoReg = 'activo'")
            .andWhere("rol.bandera = 'AETN'")
            .andWhere("rol.estadoRegistro = 'activo'");

            const roles = await queryBuilder1.getRawMany();
            funcionarioEmpresa.roles = roles;

            const queryBuilder2 = getManager()
            .createQueryBuilder()
            .select('ciae.id', 'id')
            .addSelect('ciae.codigo_ciae', 'name')
            .from(FuncionarioCiaeModel, 'funcionarioCiae')
            .innerJoin(CiaeModel, 'ciae', 'funcionarioCiae.idCiae = ciae.id')
            .where('funcionarioCiae.idFuncionarioEmpresa = :idFuncionarioEmpresa', { idFuncionarioEmpresa: funcionarioEmpresa.idFuncionarioEmpresa })
            .andWhere("funcionarioCiae.estadoReg = 'activo'")
            .andWhere("ciae.estadoReg = 'activo'");

            const ciaes = await queryBuilder2.getRawMany();
            funcionarioEmpresa.ciaes = ciaes;
        }

        return funcionariosEmpresa;

    }

}

export default FuncionarioEmpresa;
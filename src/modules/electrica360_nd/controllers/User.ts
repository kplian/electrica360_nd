
import moment from 'moment';
import crypto from 'crypto';
import { EntityManager, getManager } from 'typeorm';
import {
    Controller, Log, Post, ReadOnly, Get, Permission, PxpError
} from '@pxp-nd/core';

import PersonaModel from '../entity/Persona';
import UsuarioModel from '../entity/Usuario';
import FuncionarioModel from '../entity/Funcionario';
import EmpresaAetnModel from '../entity/EmpresaAetn';
import FuncionarioEmpresaModel from '../entity/FuncionarioEmpresa';
import UsuarioRolModel from '../entity/UsuarioRol';
import FuncionarioCiaeModel from '../entity/FuncionarioCiae';
import Driver  from '../../../helpers/Driver';

class User extends Controller {

    @Post()
    @ReadOnly(false)
    @Log(false)
    //@Permission(true)
    async  add(params: Record<string, unknown>, manager: EntityManager): Promise<any> {
        const roles = params.roles as Array<{ id: number, name: string }>;
        const ciaes = params.ciaes as Array<{ id: number, name: string }>;
        const existUser = await UsuarioModel.findOne({ username: params.username as string, status: 'activo'});
        if (existUser) {
            throw new PxpError(400, 'Cuenta de usuario en uso, busque otro nombre alternativo (recomendamos nombre.apellido.X');
        }

        const funcionarioEmpresaValid = await FuncionarioEmpresaModel.findOne({ idUsuario: this.user.userId as number, estadoReg: 'activo'});

        if (funcionarioEmpresaValid) {
            const empresaAetn = await EmpresaAetnModel.findOne(funcionarioEmpresaValid.empresaAetnId);
            if (!empresaAetn) {
                throw new PxpError(400, 'Empresa no encontrada');
            }

            let persona = new PersonaModel();
            persona.nombre = (params.nombre as string).toUpperCase();
            persona.apellidoPaterno = (params.apellidoPaterno as string).toUpperCase();
            persona.apellidoMaterno = (params.apellidoMaterno as string).toUpperCase();
            persona.correo = params.correo as string;
            persona.telefono1 = params.telefono as string;
            persona.idUsuarioReg = this.user.userId;
            persona.genero = params.genero as string;
            persona = await manager.save(persona);

            const md5 = crypto.createHash('md5');
            md5.update(params.password as string);

            let usuario = new UsuarioModel();
            usuario.idClasificador = 4;
            usuario.username = params.username as string;
            usuario.password = md5.digest('hex');
            usuario.expiration = moment(params.fechaCaducidad as string, 'YYYY-MM-DD').toDate();
            usuario.estilo = 'xtheme-blue.css';
            usuario.contrasenaAnterior = undefined;
            usuario.autentificacion = 'local';
            usuario.persona = persona;
            usuario = await manager.save(usuario);
            

            const codigoEmpresaAetn = empresaAetn.codigo + persona.id as string;

            let funcionario = new FuncionarioModel();
            funcionario.persona = persona;
            funcionario.codigo = codigoEmpresaAetn;
            funcionario.fechaReg = new Date();
            funcionario.idUsuarioReg = this.user.userId;
            funcionario.emailEmpresa = params.correo as string;
            funcionario.telefonoOfi = params.telefono as string;
            funcionario = await manager.save(funcionario);

            let funcionarioEmpresa = new FuncionarioEmpresaModel();
            funcionarioEmpresa.usuario = usuario;
            funcionarioEmpresa.funcionario = funcionario;
            funcionarioEmpresa.empresaAetn = empresaAetn;
            funcionarioEmpresa.estadoReg = 'activo';
            funcionarioEmpresa.cargo = params.cargo as string;
            funcionarioEmpresa.fechaReg = new Date();
            funcionarioEmpresa.idUsuarioReg = this.user.userId;
            funcionarioEmpresa = await manager.save(funcionarioEmpresa);

            for (const role of roles) {
                const nuevoRol = new UsuarioRolModel();
                nuevoRol.usuario = usuario;
                nuevoRol.idRol = role.id;
                nuevoRol.fechaReg = new Date();
                await manager.save(nuevoRol);
              }

            for (const ciae of ciaes) {
                const nuevoCiae = new FuncionarioCiaeModel();
                nuevoCiae.idFuncionarioEmpresa = funcionarioEmpresa.id;
                nuevoCiae.idCiae = ciae.id;
                nuevoCiae.idUsuarioReg = this.user.userId;
                await manager.save(nuevoCiae);
            };
              

            return { idUsuario: usuario.userId, idPersona: persona.id, idFuncionario: funcionario.id, idFuncionarioEmpresa: funcionarioEmpresa.id };

        } else {
            throw new PxpError(400, 'No es administrador de ninguna empresa electrica');
        }

    }

    @Post()
    @ReadOnly(false)
    @Log(false)
    //@Permission(true)
    async  modify(params: Record<string, unknown>, manager: EntityManager): Promise<any> {
        const roles = params.roles as Array<{ id: number, name: string }>;
        const ciaes = params.ciaes as Array<{ id: number, name: string }>;
        const funcionarioEmpresaValid = await FuncionarioEmpresaModel.findOne({ idUsuario: this.user.userId as number, estadoReg: 'activo'});
        if (funcionarioEmpresaValid) {
            const funcionarioEmpresaToModify = await FuncionarioEmpresaModel.findOne(params.idFuncionarioEmpresa as number);
            if (!funcionarioEmpresaToModify) {
                throw new PxpError(400, 'Funcionario no encontrado');
            }

            funcionarioEmpresaToModify.estadoReg = params.estadoReg as string;
            funcionarioEmpresaToModify.cargo = params.cargo as string;

            const funcionarioToModify = await FuncionarioModel.findOne(funcionarioEmpresaToModify.funcionarioId);
            if (!funcionarioToModify) {
                throw new PxpError(400, 'Funcionario no encontrado');
            }
            funcionarioToModify.estadoReg = params.estadoReg as string;
            funcionarioToModify.emailEmpresa = params.correo as string;
            funcionarioToModify.telefonoOfi = params.telefono as string;

            const usuarioToModify = await UsuarioModel.findOne(funcionarioEmpresaToModify.idUsuario);
            if (!usuarioToModify) {
                throw new PxpError(400, 'Usuario no encontrado');
            }
            usuarioToModify.expiration = moment(params.fechaCaducidad as string, 'YYYY-MM-DD').toDate();
            if (params.password) {
                const md5 = crypto.createHash('md5');
                md5.update(params.password as string);
                usuarioToModify.contrasenaAnterior = usuarioToModify.password;
                usuarioToModify.password = md5.digest('hex');
            }

            const personaToModify = await PersonaModel.findOne(usuarioToModify.idPersona);
            if (!personaToModify) {
                throw new PxpError(400, 'Persona no encontrada');
            }
            personaToModify.nombre = (params.nombre as string).toUpperCase();
            personaToModify.apellidoPaterno = (params.apellidoPaterno as string).toUpperCase();
            personaToModify.apellidoMaterno = (params.apellidoMaterno as string).toUpperCase();
            personaToModify.correo = params.correo as string;
            personaToModify.telefono1 = params.telefono as string;
            personaToModify.genero = params.genero as string;

            await manager.save(funcionarioEmpresaToModify);
            await manager.save(funcionarioToModify);
            await manager.save(usuarioToModify);
            await manager.save(personaToModify);

            await manager
            .createQueryBuilder()
            .delete()
            .from(UsuarioRolModel)
            .where('idUsuario = :idUsuario', { idUsuario: funcionarioEmpresaToModify.idUsuario })
            .execute();

            for (const role of roles) {
                const nuevoRol = new UsuarioRolModel();
                nuevoRol.usuario = usuarioToModify;
                nuevoRol.idRol = role.id;
                nuevoRol.fechaReg = new Date();
                await manager.save(nuevoRol);
            }

            await manager
            .createQueryBuilder()
            .delete()
            .from(FuncionarioCiaeModel)
            .where('idFuncionarioEmpresa = :idFuncionarioEmpresa', { idFuncionarioEmpresa: funcionarioEmpresaToModify.id })
            .execute();

            for (const ciae of ciaes) {
                const nuevoCiae = new FuncionarioCiaeModel();
                nuevoCiae.idFuncionarioEmpresa = funcionarioEmpresaToModify.id;
                nuevoCiae.idCiae = ciae.id;
                nuevoCiae.idUsuarioReg = this.user.userId;
                await manager.save(nuevoCiae);
            };
            
            return { idFuncionarioEmpresa: funcionarioEmpresaToModify.id, success: true };

        } else {
            throw new PxpError(400, 'No es administrador de ninguna empresa electrica');
        }
    }

    @Post()
    @ReadOnly(false)
    @Log(true)
    //@Permission(true)
    async  changePassword(params: Record<string, unknown>, manager: EntityManager): Promise<any> {
        
        const usuarioToModify = await UsuarioModel.findOne(this.user.userId);
        if (!usuarioToModify) {
            throw new PxpError(400, 'Usuario no encontrado');
        }

        const md5 = crypto.createHash('md5');
        md5.update(params.password as string);

        if (usuarioToModify.password != md5.digest('hex')) {
            throw new PxpError(400, 'Password incorrecto');
        }

        usuarioToModify.contrasenaAnterior = usuarioToModify.password;
        const md52 = crypto.createHash('md5');
        md52.update(params.newPassword as string);
        usuarioToModify.password = md52.digest('hex');
        await manager.save(usuarioToModify);
        return {success: true, message: 'Password actualizado correctamente'}


    }


}

export default User;
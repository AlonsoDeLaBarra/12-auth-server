const {request, response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req = request, res = response) => {
    try {
        const { email, name, password } = req.body;
        // Verificar email unico
        const usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario con ese email ya existe'
            });
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario( req.body );

        // Encriptar la contraseña (hash)
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        // Generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name, dbUser.email );


        // Crear el usuario de base de datos
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        })

    } catch (error)
    {
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const loginUsuario = async (req = request, res = response) => {
    try {
            
        const { email, password } = req.body;
        const dbUser = await Usuario.findOne({ email });

        // verificar que el usuario existe
        if ( !dbUser ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        //Confirmar si el password es valido
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no es correcto'
            });
        }

        //Genenrar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name, dbUser.email );

        // Respuesta correcta del servicio (200)
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const renovarToken = async (req = request, res = response) => {

    const { uid, name, email } = req;

    //Genenrar el JWT
    const token = await generarJWT( uid, name, email );

    return res.json({
        ok: true,
        uid,
        name,
        email,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renovarToken
}
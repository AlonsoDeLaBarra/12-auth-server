const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renovarToken } = require('../controllers/auth');
const { validaCampos } = require('../middlewares/valida-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Crear un nuevo usuario
router.post( '/new', [
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es oligatoria').isLength({ min: 6 }),
    validaCampos
], crearUsuario );

// Login de usuario
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es oligatoria').isLength({ min: 6 }),
    validaCampos
] ,loginUsuario );

// Validar y revalidar token
router.get( '/renew', validarJWT, renovarToken );



module.exports = router;
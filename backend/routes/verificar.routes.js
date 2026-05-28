const express = require('express');

const router = express.Router();

const {

    verificarQR

} = require(
'../controllers/verificar.controller'
);

router.post(
    '/verificar',
    verificarQR
);

module.exports = router;
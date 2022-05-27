const {check} = require('express-validator');

module.exports = [
    check('title')
        .notEmpty().withMessage("Requerido")
        .isAlphanumeric().withMessage("Nombre inválido"),
    check('rating')
        .notEmpty().withMessage("Requerido"),
    check('awards')
        .notEmpty().withMessage("Requerido"),
    check('release_date')
        .notEmpty().withMessage("Requerido"),
];
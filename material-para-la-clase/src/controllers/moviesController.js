const db = require('../database/models');
const sequelize = db.sequelize;
const {validationResult, Result} = require('express-validator');

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render("moviesAdd"); 
    },
    create: function (req, res) {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            //Guardamos los datos en la DB
            const {title, rating, release_date, awards, length} = req.body;
            db.Movie.create({
                title,
                rating,
                length,
                awards,
                release_date
            })
            //Para capturar la rta(me devuelve el elemento que se creo)
            .then(() => res.redirect('/movies'))
            .catch((error) => res.send(error))
        } else {
            //Mostramos los errores en el formulario
            res.send(errors);
        }
    },
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
            .then((Movie) => res.render("moviesEdit", {Movie}))
            .catch((error) => res.send(error))
    },
    update: function (req,res) {
        let errors = validationResult(req);

        if(errors.isEmpty()){
            // Actualizamos los datos en DB
            const {title, rating, release_date, awards, length} = req.body;
            db.Movie.update({
                //1° objeto: DATOS QUE QUIERO GUARDAR
                title,
                rating,
                length,
                awards,
                release_date,
            }, {
                //2°objeto: CONDICION
                where: {
                    id: req.params.id,
                }
            })
            .then((response) => {
                if(response == 1){
                    res.redirect("/movies")
                }else{
                    res.send("No se pudo actualizar")
                }
            })
            .catch(error => res.send(error))
        }else{
            // Mostramos errores en form
            res.send(errors);
        }

    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then((Movie) => res.render("moviesDelete", {Movie}))
            .catch(error => res.send(error))
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where: {
                id: req.params.id
            }
        })
        .then((result) => {
            if(result == 1){
                res.redirect("/movies")
            }else{
                res.send("No se pudo eliminar")
            }
        })
        .catch(error => res.send(erorr))
    }

}

module.exports = moviesController;
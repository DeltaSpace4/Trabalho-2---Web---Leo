const express = require('express');
const db = require('../Config/Db');

const controllerUsuario = require('../Controllers/ControllerUsuario');

const multer = require('multer');
const route = express.Router();

// Rodar 1x 
/*db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true }');
});*/
//db.Usuario.create({login:'admin', senha:'1234', tipo:2});

/* Upload de imagem
module.exports = route;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  "public/uploads/");
    },
    filename: (req, file, cb) => {
        req.imageName = req.body.nome + '.png'
        cb(null, req.imageName)
    },
})
const upload = multer({ storage: storage });
*/


//Home
route.get("/home", function (req, res) { 
    if (req.session.login) { res.render('home')}
    else res.redirect('/');
});


route.get('/',controllerUsuario.getLogin)
route.post("/login", controllerUsuario.postLogin);
route.get("/logout", controllerUsuario.getLogout);
route.get("/usuarioCreate", controllerUsuario.getCreate);
route.post("/usuarioCreate", controllerUsuario.postCreate);
route.get("/usuarioList", controllerUsuario.getList);
route.get("/usuarioUpdate/:id", controllerUsuario.getUpdate);
route.post("/usuarioUpdate", controllerUsuario.postUpdate);
route.get("/usuarioDelete/:id", controllerUsuario.getDelete);


//Controller Comentario
route.get("/comentarioCreate", controllerComentario.getCreate);
route.post("/comentarioCreate", controllerComentario.postCreate);
route.get("/comentarioList", controllerComentario.getList);


// Export router
module.exports = route;
route.get("/receitaUpdate/:id", controllerReceita.getUpdate);
route.post("/receitaUpdate", upload.single('imagem'), controllerReceita.postUpdate);
route.get("/receitaDelete/:id", controllerReceita.getDelete);

//Controller Comentario
route.get("/comentarioCreate", controllerComentario.getCreate);
route.post("/comentarioCreate", controllerComentario.postCreate);
route.get("/comentarioList", controllerComentario.getList);
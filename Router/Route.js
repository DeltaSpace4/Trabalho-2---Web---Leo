const express = require('express');
const db = require('../Config/Db');

const controllerAluno = require('../Controllers/ControllerAluno');

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

//Controller Aluno
route.get("/", controllerAluno.getLogin);
route.post("/login", controllerAluno.postLogin);
route.get("/logout", controllerAluno.getLogout);

route.get('/aluno', controllerAluno.list);
route.get('/aluno/cadastrar', controllerAluno.showCreate);
route.post('/CadastrarAluno', controllerAluno.create);
route.get('/aluno/ler', controllerAluno.showRead); 
// The following routes reference controllers that aren't implemented/required yet.
// Uncomment and require their controllers when they exist.
/*
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
*/

// Export router
module.exports = route;
route.get("/receitaUpdate/:id", controllerReceita.getUpdate);
route.post("/receitaUpdate", upload.single('imagem'), controllerReceita.postUpdate);
route.get("/receitaDelete/:id", controllerReceita.getDelete);

//Controller Comentario
route.get("/comentarioCreate", controllerComentario.getCreate);
route.post("/comentarioCreate", controllerComentario.postCreate);
route.get("/comentarioList", controllerComentario.getList);
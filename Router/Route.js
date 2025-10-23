const express = require('express');
const db = require('../Config/Db');

const ControllerConhecimento = require('../Controllers/ControllerConhecimento');
const ControllerProjeto = require('../Controllers/ControllerProjeto');
const ControllerTag = require('../Controllers/ControllerTag');
const ControllerUsuario = require('../Controllers/ControllerUsuario');


const multer = require('multer');
const route = express.Router();

// Rodar 1x 
/*db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true }');
});
*/
db.Usuario.create({nome:'bob', senha:'1234', email:'test'});

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
route.get("/Home", function (req, res) { 
    if (req.session.login) { res.render('Home')}
    else res.redirect('/');
});

//Usuario
route.get('/', ControllerUsuario.getLogin);
route.post("/Login", ControllerUsuario.postLogin);
route.get("/Logout", ControllerUsuario.getLogout);
route.get("/CriarUsuario", ControllerUsuario.getCreate);
route.post("/CriarUsuario", ControllerUsuario.postCreate);
route.get("/ListarUsuario", ControllerUsuario.getList);
route.get("/AtualizarUsuario/:id", ControllerUsuario.getUpdate);
route.post("/AtualizarUsuario", ControllerUsuario.postUpdate);
route.get("/DeletarUsuario/:id", ControllerUsuario.getDelete);

//Conhecimento
route.get("/CriarConhecimento", ControllerConhecimento.getCreate);
route.post("/CriarConhecimento", ControllerConhecimento.postCreate);
route.get("/ListarConhecimento", ControllerConhecimento.getList);
route.get("/AtualizarConhecimento/:id", ControllerConhecimento.getUpdate);
route.post("/AtualizarConhecimento", ControllerConhecimento.postUpdate);
route.get("/DeletarConhecimento/:id", ControllerConhecimento.getDelete);

//Projeto
route.get("/CriarProjeto", ControllerProjeto.getCreate);
route.post("/CriarProjeto", ControllerProjeto.postCreate);
route.get("/ListarProjeto", ControllerProjeto.getList);
route.get("/AtualizarProjeto/:id", ControllerProjeto.getUpdate);
route.post("/AtualizarProjeto", ControllerProjeto.postUpdate);
route.get("/DeletarProjeto/:id", ControllerProjeto.getDelete);

//Tag
route.get("/CriarTag", ControllerTag.getCreate);
route.post("/CriarTag", ControllerTag.postCreate);
route.get("/ListarTag", ControllerTag.getList);
route.get("/AtualizarTag/:id", ControllerTag.getUpdate);
route.post("/AtualizarTag", ControllerTag.postUpdate);
route.get("/DeletarTag/:id", ControllerTag.getDelete);


// Export router
module.exports = route;

//Controller Comentario
/*route.get("/comentarioCreate", ControllerComentario.getCreate);
route.post("/comentarioCreate", ControllerComentario.postCreate);
route.get("/comentarioList", ControllerComentario.getList);*/
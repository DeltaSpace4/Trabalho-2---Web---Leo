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
//db.Usuario.create({nome:'bob', senha:'1234', email:'test@gmail.com',tipo:'admin'});

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
    console.log('Home route - Session:', req.session);
    if (req.session.email) { 
        res.render('home', {
            layout: 'main',
            email: req.session.email,
            nome: req.session.nome,
            admin: res.locals.admin
        });
    } else {
        res.redirect('/');
    }
});

//Usuario
route.get('/', ControllerUsuario.getLogin);
route.post("/login", ControllerUsuario.postLogin);
route.get("/logout", ControllerUsuario.getLogout);
route.get("/criarUsuario", ControllerUsuario.getCreate);
route.post("/criarUsuario", ControllerUsuario.postCreate);
route.get("/listarUsuario", ControllerUsuario.getList);
route.get("/atualizarUsuario/:id", ControllerUsuario.getUpdate);
route.post("/atualizarUsuario", ControllerUsuario.postUpdate);
route.get("/deletarUsuario/:id", ControllerUsuario.getDelete);

//Conhecimento
route.get("/criarConhecimento", ControllerConhecimento.getCreate);
route.post("/criarConhecimento", ControllerConhecimento.postCreate);
route.get("/listarConhecimento", ControllerConhecimento.getList);
route.get("/atualizarConhecimento/:id", ControllerConhecimento.getUpdate);
route.post("/atualizarConhecimento", ControllerConhecimento.postUpdate);
route.get("/deletarConhecimento/:id", ControllerConhecimento.getDelete);

//Projeto
route.get("/criarProjeto", ControllerProjeto.getCreate);
route.post("/criarProjeto", ControllerProjeto.postCreate);
route.get("/listarProjeto", ControllerProjeto.getList);
route.get("/atualizarProjeto/:id", ControllerProjeto.getUpdate);
route.post("/atualizarProjeto", ControllerProjeto.postUpdate);
route.get("/deletarProjeto/:id", ControllerProjeto.getDelete);

//Tag
route.get("/criarTag", ControllerTag.getCreate);
route.post("/criarTag", ControllerTag.postCreate);
route.get("/listarTag", ControllerTag.getList);
route.get("/atualizarTag/:id", ControllerTag.getUpdate);
route.post("/atualizarTag", ControllerTag.postUpdate);
route.get("/deletarTag/:id", ControllerTag.getDelete);


// Export router
module.exports = route;

//Controller Comentario
/*route.get("/comentarioCreate", ControllerComentario.getCreate);
route.post("/comentarioCreate", ControllerComentario.postCreate);
route.get("/comentarioList", ControllerComentario.getList);*/
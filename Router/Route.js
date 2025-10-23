const express = require('express');
const db = require('../Config/Db');

const ControllerConhecimento = require('../Controllers/ControllerConhecimento');
const ControllerProjeto = require('../Controllers/ControllerProjeto');
const ControllerTag = require('../Controllers/ControllerTag');
const ControllerUsuario = require('../Controllers/ControllerUsuario');


const multer = require('multer');
const route = express.Router();

// Rodar 1x 
db.sequelize.sync({ force: true })
    .then(() => console.log('Tabelas criadas!'))
    .catch(err => console.error(err));

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
route.get("/home", function (req, res) { 
    if (req.session.login) { res.render('home')}
    else res.redirect('/');
});

//Usuario
route.get('/',ControllerUsuario.getLogin)
route.post("/Login", ControllerUsuario.postLogin);
route.get("/Logout", ControllerUsuario.getLogout);
route.get("/UsuarioCreate", ControllerUsuario.getCreate);
route.post("/UsuarioCreate", ControllerUsuario.postCreate);
route.get("/UsuarioList", ControllerUsuario.getList);
route.get("/UsuarioUpdate/:id", ControllerUsuario.getUpdate);
route.post("/UsuarioUpdate", ControllerUsuario.postUpdate);
route.get("/UsuarioDelete/:id", ControllerUsuario.getDelete);

//Conhecimento
route.get("/ConhecimentoCreate", ControllerConhecimento.getCreate);
route.post("/ConhecimentoCreate", ControllerConhecimento.postCreate);
route.get("/ConhecimentoList", ControllerConhecimento.getList);
route.get("/ConhecimentoUpdate/:id", ControllerConhecimento.getUpdate);
route.post("/ConhecimentoUpdate", ControllerConhecimento.postUpdate);
route.get("/ConhecimentoDelete/:id", ControllerConhecimento.getDelete);

//Projeto
route.get("/ProjetoCreate", ControllerProjeto.getCreate);
route.post("/ProjetoCreate", ControllerProjeto.postCreate);
route.get("/ProjetoList", ControllerProjeto.getList);
route.get("/ProjetoUpdate/:id", ControllerProjeto.getUpdate);
route.post("/ProjetoUpdate", ControllerProjeto.postUpdate);
route.get("/ProjetoDelete/:id", ControllerProjeto.getDelete);

//Tag
route.get("/TagCreate", ControllerTag.getCreate);
route.post("/TagCreate", ControllerTag.postCreate);
route.get("/TagList", ControllerTag.getList);
route.get("/TagUpdate/:id", ControllerTag.getUpdate);
route.post("/TagUpdate", ControllerTag.postUpdate);
route.get("/TagDelete/:id", ControllerTag.getDelete);

// Export router
module.exports = route;

//Controller Comentario
/*route.get("/comentarioCreate", ControllerComentario.getCreate);
route.post("/comentarioCreate", ControllerComentario.postCreate);
route.get("/comentarioList", ControllerComentario.getList);*/
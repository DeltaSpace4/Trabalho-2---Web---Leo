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


route.get('/',ControllerUsuario.getLogin)
route.post("/login", ControllerUsuario.postLogin);
route.get("/logout", ControllerUsuario.getLogout);
route.get("/usuarioCreate", ControllerUsuario.getCreate);
route.post("/usuarioCreate", ControllerUsuario.postCreate);
route.get("/usuarioList", ControllerUsuario.getList);
route.get("/usuarioUpdate/:id", ControllerUsuario.getUpdate);
route.post("/usuarioUpdate", ControllerUsuario.postUpdate);
route.get("/usuarioDelete/:id", ControllerUsuario.getDelete);

route.get("/ConhecimentoCreate", ControllerConhecimento.getCreate);
route.post("/ConhecimentoCreate", ControllerConhecimento.postCreate);
route.get("/ConhecimentoList", ControllerConhecimento.getList);
route.get("/ConhecimentoUpdate/:id", ControllerConhecimento.getUpdate);
route.post("/ConhecimentoUpdate", ControllerConhecimento.postUpdate);
route.get("/ConhecimentoDelete/:id", ControllerConhecimento.getDelete);

route.get("/ProjetoCreate", ControllerProjeto.getCreate);
route.post("/ProjetoCreate", ControllerProjeto.postCreate);
route.get("/ProjetoList", ControllerProjeto.getList);
route.get("/ProjetoUpdate/:id", ControllerProjeto.getUpdate);
route.post("/ProjetoUpdate", ControllerProjeto.postUpdate);
route.get("/ProjetoDelete/:id", ControllerProjeto.getDelete);

route.get("/TagCreate", ControllerTag.getCreate);
route.post("/TagCreate", ControllerTag.postCreate);
route.get("/TagList", ControllerTag.getList);
route.get("/TagUpdate/:id", ControllerTag.getUpdate);
route.post("/TagUpdate", ControllerTag.postUpdate);
route.get("/TagDelete/:id", ControllerTag.getDelete);

//Controller Comentario
route.get("/comentarioCreate", controllerComentario.getCreate);
route.post("/comentarioCreate", controllerComentario.postCreate);
route.get("/comentarioList", controllerComentario.getList);


// Export router
module.exports = route;

//Controller Comentario
route.get("/comentarioCreate", controllerComentario.getCreate);
route.post("/comentarioCreate", controllerComentario.postCreate);
route.get("/comentarioList", controllerComentario.getList);
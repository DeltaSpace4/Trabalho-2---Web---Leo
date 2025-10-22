const express = require('express');
const db = require('../Config/Db');

const controllerAluno = require('../controllers/ControllerAluno');

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
route.get("/", ControllerAluno.getLogin);
route.post("/login", ControllerAluno.postLogin);
route.get("/logout", ControllerAluno.getLogout);

route.get('/aluno', ControllerAluno.list);
route.get('/aluno/cadastrar', ControllerAluno.showCreate);
route.post('/CadastrarAluno', ControllerAluno.create);
route.get('/aluno/ler', ControllerAluno.showRead); 
route.post('/LerAluno', ControllerAluno.read);

route.get('/aluno/atualizar', ControllerAluno.showUpdate);
route.post('/AtualizarAluno', ControllerAluno.update);

route.get('/aluno/deletar', ControllerAluno.showDelete);
route.post('/DeletarAluno', ControllerAluno.delete);


//
route.get("/usuarioCreate", controllerUsuario.getCreate);
route.post("/usuarioCreate", controllerUsuario.postCreate);
route.get("/usuarioList", controllerUsuario.getList);
route.get("/usuarioUpdate/:id", controllerUsuario.getUpdate);
route.post("/usuarioUpdate", controllerUsuario.postUpdate);
route.get("/usuarioDelete/:id", controllerUsuario.getDelete);

//Controller Categoria
route.get("/categoriaCreate", controllerCategoria.getCreate);
route.post("/categoriaCreate", controllerCategoria.postCreate);
route.get("/categoriaList", controllerCategoria.getList);
route.get("/categoriaUpdate/:id", controllerCategoria.getUpdate);
route.post("/categoriaUpdate", controllerCategoria.postUpdate);
route.get("/categoriaDelete/:id", controllerCategoria.getDelete);

//Controller Receita
route.get("/receitaCreate", controllerReceita.getCreate);
route.post("/receitaCreate",  upload.single('imagem'), controllerReceita.postCreate);
route.get("/receitaList", controllerReceita.getList);
route.get("/receitaUpdate/:id", controllerReceita.getUpdate);
route.post("/receitaUpdate", upload.single('imagem'), controllerReceita.postUpdate);
route.get("/receitaDelete/:id", controllerReceita.getDelete);

//Controller Comentario
route.get("/comentarioCreate", controllerComentario.getCreate);
route.post("/comentarioCreate", controllerComentario.postCreate);
route.get("/comentarioList", controllerComentario.getList);
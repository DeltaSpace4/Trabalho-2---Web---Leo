const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogProjetoSchema = new Schema({
  texto: { type: String, required: true }, // Ex: "Projeto foi criado", "Projeto foi atualizado", "Usuário foi conectado ao projeto @nome"
  modificadorId: { type: Number, required: true }, // vem do Postgres (id do usuário)
  modificadorEmail: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('logProjeto', LogProjetoSchema);
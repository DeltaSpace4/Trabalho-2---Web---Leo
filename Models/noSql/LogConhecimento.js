const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogConhecimentoSchema = new Schema({
  texto: { type: String, required: true }, // Ex: "Conhecimento foi criado", "Conhecimento foi atualizado", "Usuário foi conectado ao Conhecimento @nome"
  modificadorId: { type: Number, required: true }, // vem do Postgres (id do usuário)
  modificadorEmail: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('logConhecimento', LogConhecimentoSchema);
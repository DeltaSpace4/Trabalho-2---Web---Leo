const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogProjetoSchema = new Schema({
  texto: { type: String, required: true }, // Ex: "Projeto foi criado", "Projeto foi atualizado", "Usuário foi conectado ao projeto @nome"
  modificadorId: { type: Number, required: true }, // vem do Postgres (id do usuário)
  modificadorEmail: { type: String, required: true },
}, { timestamps: true });

LogProjetoSchema.statics.logarProjeto = async function(texto, modificadorId, modificadorEmail) {
  try {
    const log = new this({
      texto,
      modificadorId,
      modificadorEmail
    });
    await log.save();
    console.log("Log salvo:", texto);
  } catch (err) {
    console.error("Erro ao salvar log:", err.message);
    throw err; 
  }
};
module.exports = mongoose.model('logProjeto', LogProjetoSchema);
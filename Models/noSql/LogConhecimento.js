const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogConhecimentoSchema = new Schema({
  texto: { type: String, required: true }, // Ex: "Conhecimento foi criado", "Conhecimento foi atualizado", "Usuário foi conectado ao Conhecimento @nome"
  modificadorId: { type: Number, required: true }, // vem do Postgres (id do usuário)
  modificadorEmail: { type: String, required: true },
}, { timestamps: true });

LogConhecimentoSchema.statics.logarConhecimento = async function(texto, modificadorId, modificadorEmail) {
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

module.exports = mongoose.model('logConhecimento', LogConhecimentoSchema);
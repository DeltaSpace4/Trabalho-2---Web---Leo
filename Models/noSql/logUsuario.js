const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogUsuarioSchema = new Schema({
  texto: { type: String, required: true }, // Ex: "Usuário foi criado", "Usuário foi conectado ao projeto @nome"
  modificadorId: { type: Number, required: true }, // vem do Postgres (id do usuário)
  modificadorEmail: { type: String, required: true },
}, { timestamps: true });

LogUsuarioSchema.statics.logarUsuario = async function (texto, modificadorId, modificadorEmail) {
  const novoLog = new this({ texto, modificadorId, modificadorEmail });
  return await novoLog.save();
};

module.exports = mongoose.model('logUsuario', LogUsuarioSchema);
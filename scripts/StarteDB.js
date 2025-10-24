const db = require('../Config/Db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function initDB() {
  try {
    await db.sequelize.authenticate();
    console.log('Connected to database.');

    await db.sequelize.sync();
    console.log('\nDatabase synchronized. Tables created/updated.');


    const hashedPassword = await bcrypt.hash('123', saltRounds);

    const Usuario = await db.Usuario.create({
      nome: 'Test',
      senha: hashedPassword,
      email: 'test@email.com',
      tipo: 'admin'
    });
    console.log('\nTest user created:', Usuario.toJSON());

    const Conhecimento = await db.Conhecimento.create({
      nome: 'Conhecimento',
    });
    console.log('\nTest conhecimento created:', Conhecimento.toJSON());

    const Tag = await db.Tag.create({
      nome: 'Tag',
    });
    console.log('\nTest tag created:', Tag.toJSON());

    const Projeto = await db.Projeto.create({
      nome: 'Projeto',
      resumo:'Resumo',
      link:'Link'
    });
    console.log('\nTest projeto created:', Projeto.toJSON());

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await db.sequelize.close();
  }
}

initDB();
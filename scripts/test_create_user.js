const db = require('../Config/Db');

async function run() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // sync without forcing
    await db.sequelize.sync();
    console.log('Sync complete.');

    const user = await db.Usuario.create({
      nome: 'Test User',
      senha: 'test123',
      email: 'test@example.com',
      tipo: 'aluno'
    });
    console.log('Created user:', user.toJSON());
  } catch (err) {
    console.error('Error during test create:', err);
  } finally {
    await db.sequelize.close();
  }
}

run();

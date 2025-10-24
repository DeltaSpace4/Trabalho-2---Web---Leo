const db = require('../Config/Db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function initDB() {
  try {
    await db.sequelize.authenticate();
    console.log('Connected to database.');

    // Create/update tables to match models
    await db.sequelize.sync();
    console.log('\nDatabase synchronized. Tables created/updated.');


    const hashedPassword = await bcrypt.hash('123', saltRounds);

    // Create a test user to verify
    const testUser = await db.Usuario.create({
      nome: 'Test',
      senha: hashedPassword,
      email: 'test@example.com',
      tipo: 'admin'
    });
    console.log('\nTest user created:', testUser.toJSON());

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await db.sequelize.close();
  }
}

initDB();
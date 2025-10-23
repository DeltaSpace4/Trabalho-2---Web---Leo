const db = require('../Config/Db');

async function initDB() {
  try {
    await db.sequelize.authenticate();
    console.log('Connected to database.');

    // Create/update tables to match models
    await db.sequelize.sync();
    console.log('\nDatabase synchronized. Tables created/updated.');

    // Create a test user to verify
    const testUser = await db.Usuario.create({
      nome: 'Test User',
      senha: 'test123',
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
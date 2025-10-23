const db = require('../Config/Db');

async function showStructure() {
  try {
    await db.sequelize.authenticate();
    console.log('Connected to database.');

    // Query to show table structure
    const [results] = await db.sequelize.query(`
      SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'usuarios'
      ORDER BY ordinal_position;
    `);
    
    console.log('\nCurrent usuarios table structure:');
    console.table(results);

    // Show model structure
    console.log('\nModel structure from Usuario.js:');
    const modelFields = Object.keys(db.Usuario.rawAttributes).map(field => ({
      field,
      ...db.Usuario.rawAttributes[field]
    }));
    console.log(modelFields.map(f => `${f.field}: ${f.type.toString()}`).join('\n'));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await db.sequelize.close();
  }
}

showStructure();
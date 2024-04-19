import { Sequelize } from 'sequelize';

const databaseName = 'new_db';

const sequelize = new Sequelize('', 'root', 'root', {
  dialect: 'mysql',
  logging: (msg) => console.log(`Database connection successful: ${msg}`),
});

sequelize.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`)
  .then(() => {
    console.log(`Database '${databaseName}' created successfully or already exists.`);
  })
  .catch((error) => {
    console.error(`Error creating database '${databaseName}':`, error);
  })
  .finally(() => {
    sequelize.close();
});


export default new Sequelize(`mysql://root:root@localhost:3306/${databaseName}`, {
  dialect: 'mysql',
  logging: false,
});

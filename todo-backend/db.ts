import { Sequelize } from 'sequelize';

// Create sequelize instance including all the details of the database we want to connect to

const sequelize = new Sequelize('todo_app', 'jonas', '', {
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log,
});

export default sequelize;
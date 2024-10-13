import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('todo_app', 'jonas', '', {
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log, // This enables logging
});

export default sequelize;
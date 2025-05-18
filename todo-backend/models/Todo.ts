// Written in separate file than db.ts to simplify exporting

import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

// Create Todo data model so it can be used in other files. '!' allows us to skip value assignment here and save Todo as a blueprint.

class Todo extends Model {
    public id!: number;
    public text!: string;
    public isDone!: boolean;
    public createdAt!: Date;
};

// Define properties we expect the database to have (has to be congruent with the database)

Todo.init(
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        // Other model options
        sequelize, // Connection instance (defined above)
        modelName: 'todo_app' // If there are bugs, maybe switch back to tableName
    }
);

export default Todo;
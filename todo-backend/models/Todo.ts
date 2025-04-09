import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

// Define what Todo objects should look like (define Todo class)

class Todo extends Model {
    public id!: number;
    public text!: string;
    public isDone!: boolean;
    public createdAt!: Date;
}

// Initialize Sequelize data model

Todo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isDone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'todos',
    timestamps: false,
});

export default Todo;
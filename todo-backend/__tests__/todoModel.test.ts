import { Sequelize } from 'sequelize';
import Todo from '../models/Todo';
import sequelize from '../db';

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database
});

afterAll(async () => {
    await sequelize.close(); // Close the connection after tests
});

describe('Todo Model', () => {
    test('should create a todo item', async () => {
        const todo = await Todo.create({ text: 'Test todo', isDone: false });
        expect(todo.id).toBeDefined(); // Check if ID is defined
        expect(todo.text).toBe('Test todo'); // Validate text
        expect(todo.isDone).toBe(false); // Validate isDone
    });

    test('should not create a todo without text', async () => {
        await expect(Todo.create({ isDone: false })).rejects.toThrow();
    });

    test('should create multiple todo items', async () => {
        await Todo.bulkCreate([
            { text: 'Todo 1', isDone: true },
            { text: 'Todo 2', isDone: false },
        ]);
        const todos = await Todo.findAll();
        expect(todos.length).toBe(2); // Validate count
    });
});

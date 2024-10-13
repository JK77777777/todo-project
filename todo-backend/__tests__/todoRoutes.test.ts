import request from 'supertest';
import app from '../index'; // Ensure your Express app is exported from index.ts

describe('Todo API', () => {
    test('GET /todos should return an empty array initially', async () => {
        const res = await request(app).get('/todos');
        expect(res.status).toBe(200); // Check status
        expect(res.body).toEqual([]); // Expect an empty array
    });

    test('POST /todos should create a new todo', async () => {
        const res = await request(app)
            .post('/todos')
            .send({ text: 'New todo', isDone: false });
        expect(res.status).toBe(201); // Check status
        expect(res.body.text).toBe('New todo'); // Validate response
        expect(res.body.isDone).toBe(false); // Validate isDone
    });

    test('GET /todos should return created todos', async () => {
        const res = await request(app).get('/todos');
        expect(res.status).toBe(200); // Check status
        expect(res.body.length).toBe(1); // Check length of todos
    });
});

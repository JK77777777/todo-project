import { http, HttpResponse } from 'msw';

// Mock data
const todos = [
    { id: 1, text: 'Test Todo 1', isDone: false, createdAt: new Date().toISOString() },
];

// Define Todo type
interface Todo {
    id: number;
    text: string;
    isDone: boolean;
    createdAt: string;
}

export const handlers = [
    // GET /todos
    http.get('http://localhost:3000/todos', () => {
        return HttpResponse.json(todos, { status: 200 });
    }),

    // POST /todos
    http.post('http://localhost:3000/todos', async ({ request }) => {
        const { text, isDone, createdAt } = await request.json() as Todo;
        const newTodo: Todo = { 
            id: todos.length + 1, 
            text, 
            isDone, 
            createdAt 
        };
        todos.push(newTodo);
        return HttpResponse.json(newTodo, { status: 201 });
    }),

    // PUT /todos/:id
    http.put('http://localhost:3000/todos/:id', async ({ request, params }) => {
        const id = parseInt(params.id as string);
        const updates = await request.json() as Partial<Todo>;
        const index = todos.findIndex((todo) => todo.id === id);
        
        if (index !== -1) {
            todos[index] = { ...todos[index], ...updates };
            return HttpResponse.json(todos[index], { status: 200 });
        }
        return HttpResponse.json({ message: 'Todo not found' }, { status: 404 });
    }),

    // DELETE /todos/:id
    http.delete('http://localhost:3000/todos/:id', ({ params }) => {
        const id = parseInt(params.id as string);
        const index = todos.findIndex((todo) => todo.id === id);
        
        if (index !== -1) {
            todos.splice(index, 1);
            return new HttpResponse(null, { status: 200 });
        }
        return HttpResponse.json({ message: 'Todo not found' }, { status: 404 });
    }),
];
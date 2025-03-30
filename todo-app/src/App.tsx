import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import { Todo, backendPort } from './types';

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(`http://localhost:${backendPort}/todos`);
                if (!response.ok) throw new Error('Failed to fetch todos');
                const data = await response.json();
                setTodos(data);
            } catch (error) {
                console.error('Fetch todos failed:', error);
            }
        };
        fetchTodos();
    }, []);

    const updateTodos = (newTodos: Todo[] | ((prev: Todo[]) => Todo[])) => {
        setTodos(newTodos);
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Todo List</h1>
            <TodoList todos={todos} updateTodos={updateTodos} />
            <AddTodo updateTodos={updateTodos} />
        </div>
    );
};

export default App;
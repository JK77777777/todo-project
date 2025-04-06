import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import { Todo, backendPort } from './types';

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    // fetch todos on mount
    useEffect(() => {
        // define fetchTodos
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
        // execute fetchTodos
        fetchTodos();
    }, []); // function only runs only on mount because no dependencies defined

    // update todos every time Todo array changes
    // newTodos is of type Todo[] or it is 
    // '(prev: Todo[]) => Todo[])' is a function that receives the current Todo list ('prev') and produces an updated Todo list
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
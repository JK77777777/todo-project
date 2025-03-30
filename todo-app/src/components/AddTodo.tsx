import React, { useState } from 'react';
import { backendPort, Todo } from '../types';

interface AddTodoProps {
    updateTodos: (newTodos: Todo[] | ((prev: Todo[]) => Todo[])) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ updateTodos }) => {
    const [text, setText] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return; // Prevents creation of todo if empty or only spaces

        try {
            const response = await fetch(`http://localhost:${backendPort}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }), // Backend sets isDone, createdAt
            });

            if (!response.ok) throw new Error('Failed to add todo');
            const newTodo = await response.json();
            console.log('Todo added:', newTodo);
            updateTodos((prev) => [...prev, newTodo]); // Update after confirmation
            setText(''); // Clear input after success
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="New task"
            />
            <button type="submit">Add Todo</button>
        </form>
    );
};

export default AddTodo;
// todo-app/src/components/TodoItem.tsx
import React, { useState } from 'react';
import { Todo, TodoItemProps } from '../types';
import { backendPort } from '../types';

interface ExtendedTodoItemProps extends TodoItemProps {
    updateTodos: (newTodos: Todo[] | ((prev: Todo[]) => Todo[])) => void;
}

const TodoItem: React.FC<ExtendedTodoItemProps> = ({ todo, backendPort, onDelete, updateTodos }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftText, setDraftText] = useState(todo.text);

    const handleToggleDone = () => {
        const updatedTodo = { ...todo, isDone: !todo.isDone };
        fetch(`http://localhost:${backendPort}/todos/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to update');
                return res.json();
            })
            .then((data) => {
                updateTodos((prev) =>
                    prev.map((t) => (t.id === todo.id ? data : t))
                ); // Update after confirmation
            })
            .catch(console.error);
    };

    const handleSaveEdit = () => {
        const updatedTodo = { ...todo, text: draftText };
        fetch(`http://localhost:${backendPort}/todos/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to edit');
                return res.json();
            })
            .then((data) => {
                setIsEditing(false); // Exit edit mode after confirmation
                updateTodos((prev) =>
                    prev.map((t) => (t.id === todo.id ? data : t))
                ); // Update after confirmation
            })
            .catch(console.error);
    };

    const handleDelete = () => {
        fetch(`http://localhost:${backendPort}/todos/${todo.id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to delete');
                onDelete(todo.id); // Remove after confirmation (204 response)
            })
            .catch(console.error);
    };

    return (
        <div style={{ margin: '0.5rem 0' }}>
            {isEditing ? (
                <input
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                />
            ) : (
                <span style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
                    {todo.text}
                </span>
            )}
            <div style={{ marginTop: '0.5rem' }}>
                <label>
                    <input
                        type="checkbox"
                        checked={todo.isDone}
                        onChange={handleToggleDone}
                    />
                    Done
                </label>
                {isEditing ? (
                    <button onClick={handleSaveEdit}>Save</button>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                )}
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default TodoItem;
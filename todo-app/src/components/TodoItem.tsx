import React, { useState } from 'react';
import { Todo, TodoItemProps } from '../types';
import { backendPort } from '../types';

const TodoItem: React.FC<TodoItemProps> = ({ todo,backendPort, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftText, setDraftText] = useState(todo.text);
    const [done, setDone] = useState(todo.isDone);
    
    const handleToggleDone = () => {
        fetch(`http://localhost:${backendPort}/todos/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...todo, isDone: !done}),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to update');
                return res.json();
            })
            .then(() => setDone(!done))
            .catch(console.error);
    }

    const handleSaveEdit = () => {
        fetch(`http://localhost:${backendPort}/todos/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application.json' },
            body: JSON.stringify({ ...todo, text: draftText }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to edit');
                return res.json();
            })
            .then(() => setIsEditing(false))
            .catch(console.error);
    };

    const handleDelete = () => {
        fetch(`http://localhost:${backendPort}/todos/${todo.id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to delete');
                onDelete(todo.id);
            })
            .catch(console.error);
    };

    return (
        <div style={{ margin: '0.5rem 0'}}>
            {isEditing ? (
                <input
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                />
            ) : (
                <span style={{ textDecoration: done ? 'line-through' : 'none'}}>
                    {todo.text}
                </span>
            )}

            <div style={{ marginTop: '0.5rem '}}>
                <label>
                    <input
                        type='checkbox'
                        checked={done}
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
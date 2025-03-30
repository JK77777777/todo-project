export const backendPort = 5001;

export interface Todo {
    id: number;
    text: string;
    isDone: boolean;
    createdAt: string;
}

export interface TodoItemProps {
    todo: Todo;
    backendPort: number;
    onDelete: (id: number) => void;
}
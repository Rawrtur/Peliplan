declare global {
    interface User {
    _id: string;
    email: string;
    name: string;
    password: string;
    verified: boolean;
    role: "Tester"| "Premium" | "Admin" | "User",
    streak: number;
  }
  interface Todo {
    id: number;
    title: string;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    checked: boolean;
  }
  interface Template {
    _id: string;
    title: string;
    todos: Todo[];
  }
}

export {};
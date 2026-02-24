import { useState } from "react";
import { Plus, Check, Trash2, Filter } from "lucide-react";
import { Todo, sampleTodos } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
  const [newCategory, setNewCategory] = useState("General");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      priority: newPriority,
      category: newCategory,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTodos([todo, ...todos]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filtered = todos.filter(t =>
    filter === "all" ? true : filter === "pending" ? !t.completed : t.completed
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold">Todo List</h1>
        <p className="text-muted-foreground mt-1">Manage your academic tasks efficiently.</p>
      </div>

      {/* Add todo */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="flex-1 min-w-[200px]"
          />
          <Select value={newPriority} onValueChange={(v: any) => setNewPriority(v)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-[130px]"
          />
          <Button onClick={addTodo} className="gradient-accent text-secondary">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "pending", "completed"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <div className="space-y-2">
        {filtered.map(todo => (
          <div
            key={todo.id}
            className={`glass-card rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md ${
              todo.completed ? "opacity-60" : ""
            }`}
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                todo.completed
                  ? "bg-accent border-accent"
                  : "border-border hover:border-primary"
              }`}
            >
              {todo.completed && <Check className="w-3 h-3 text-secondary" />}
            </button>
            <div className="flex-1">
              <p className={`text-sm font-medium ${todo.completed ? "line-through" : ""}`}>
                {todo.text}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{todo.category}</span>
                {todo.dueDate && (
                  <span className="text-xs text-muted-foreground">• Due: {todo.dueDate}</span>
                )}
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              todo.priority === "high" ? "bg-destructive/10 text-destructive" :
              todo.priority === "medium" ? "bg-accent/10 text-primary" :
              "bg-muted text-muted-foreground"
            }`}>
              {todo.priority}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;

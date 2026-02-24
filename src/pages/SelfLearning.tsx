import { useState } from "react";
import { Plus, BookOpen, Clock, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LearningTask {
  id: string;
  title: string;
  subject: string;
  duration: string;
  status: "planned" | "in-progress" | "completed";
  notes?: string;
}

const initialTasks: LearningTask[] = [
  { id: "1", title: "Watch MIT OCW - Algorithms", subject: "CS", duration: "2h", status: "planned" },
  { id: "2", title: "Practice Calculus Problems", subject: "Math", duration: "1.5h", status: "in-progress" },
  { id: "3", title: "Read Research Paper on ML", subject: "CS", duration: "1h", status: "completed" },
  { id: "4", title: "Review Quantum Physics Notes", subject: "Physics", duration: "45m", status: "planned" },
];

const SelfLearning = () => {
  const [tasks, setTasks] = useState<LearningTask[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");

  const addTask = () => {
    if (!title.trim()) return;
    setTasks([{ id: Date.now().toString(), title, subject, duration, status: "planned" }, ...tasks]);
    setTitle(""); setSubject(""); setDuration("");
  };

  const updateStatus = (id: string, status: LearningTask["status"]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  const statusIcon = (status: string) => {
    if (status === "completed") return <Check className="w-4 h-4 text-success" />;
    if (status === "in-progress") return <Clock className="w-4 h-4 text-accent" />;
    return <BookOpen className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold">Self Learning</h1>
        <p className="text-muted-foreground mt-1">Schedule and track your self-study sessions.</p>
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex gap-3 flex-wrap">
          <Input placeholder="Learning task..." value={title} onChange={e => setTitle(e.target.value)} className="flex-1 min-w-[200px]" />
          <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-[120px]" />
          <Input placeholder="Duration" value={duration} onChange={e => setDuration(e.target.value)} className="w-[100px]" />
          <Button onClick={addTask} className="gradient-accent text-secondary">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["planned", "in-progress", "completed"] as const).map(status => (
          <div key={status} className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              {statusIcon(status)} {status.replace("-", " ")}
              <span className="ml-auto bg-muted px-2 py-0.5 rounded-full text-xs">
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            {tasks.filter(t => t.status === status).map(task => (
              <div key={task.id} className="glass-card rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium">{task.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {task.subject && <span className="px-2 py-0.5 bg-primary/10 rounded-full text-primary">{task.subject}</span>}
                  {task.duration && <span>{task.duration}</span>}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Select value={task.status} onValueChange={(v: any) => updateStatus(task.id, v)}>
                    <SelectTrigger className="h-7 text-xs flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelfLearning;

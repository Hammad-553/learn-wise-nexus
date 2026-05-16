import { useState } from "react";
import { Assignment, sampleAssignments } from "@/lib/store";
import { Plus, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const statusColors: Record<string, string> = {
  pending: "bg-destructive/10 text-destructive",
  "in-progress": "bg-accent/10 text-primary",
  completed: "bg-success/10 text-success",
};

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const addAssignment = () => {
    if (!title.trim() || !subject.trim()) return;
    const a: Assignment = {
      id: Date.now().toString(),
      title, subject, dueDate,
      status: "pending", priority,
    };
    setAssignments([a, ...assignments]);
    setTitle(""); setSubject(""); setDueDate("");
    setOpen(false);
  };

  const updateStatus = (id: string, status: Assignment["status"]) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments & Projects</h1>
          <p className="text-muted-foreground mt-1">Track all your academic submissions.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-accent text-secondary"><Plus className="w-4 h-4 mr-1" /> New Assignment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Assignment</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-3">
              <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addAssignment} className="w-full gradient-primary text-primary-foreground">Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map(a => (
          <div key={a.id} className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[a.status]}`}>
                    {a.status}
                  </span>
                  <button
                    onClick={() => deleteAssignment(a.id)}
                    aria-label="Delete assignment"
                    title="Delete"
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            <h3 className="font-semibold text-sm">{a.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{a.subject}</p>
            {a.description && <p className="text-xs text-muted-foreground mt-2">{a.description}</p>}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">Due: {a.dueDate}</span>
              <Select value={a.status} onValueChange={(v: any) => updateStatus(a.id, v)}>
                <SelectTrigger className="h-7 w-[120px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;

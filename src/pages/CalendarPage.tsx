import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarEvent } from "@/lib/store";
import { useStore, storeActions } from "@/lib/persistentStore";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const eventTypeColors: Record<string, string> = {
  class: "bg-primary",
  exam: "bg-destructive",
  assignment: "bg-accent",
  study: "bg-teal-light",
  other: "bg-muted-foreground",
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const events = useStore(s => s.events);
  const setEvents = storeActions.setEvents;
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<CalendarEvent["type"]>("class");
  const [newTime, setNewTime] = useState("");
  const [open, setOpen] = useState(false);

  const selectedDateStr = date?.toISOString().split("T")[0] || "";
  const dayEvents = events.filter(e => e.date === selectedDateStr);

  const addEvent = () => {
    if (!newTitle.trim() || !date) return;
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newTitle,
      date: selectedDateStr,
      type: newType,
      time: newTime || undefined,
    };
    setEvents(prev => [...prev, event]);
    setNewTitle("");
    setNewTime("");
    setOpen(false);
  };

  const eventDates = events.map(e => new Date(e.date + "T00:00:00"));

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">Track your academic schedule.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-accent text-secondary">
              <Plus className="w-4 h-4 mr-1" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Event on {selectedDateStr}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-3">
              <Input placeholder="Event title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              <Input placeholder="Time (e.g. 09:00)" value={newTime} onChange={e => setNewTime(e.target.value)} />
              <Select value={newType} onValueChange={(v: any) => setNewType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addEvent} className="w-full gradient-primary text-primary-foreground">Add Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl p-5 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={{ event: eventDates }}
            modifiersClassNames={{ event: "bg-accent/20 font-bold" }}
            className="rounded-md"
          />
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">
            Events on {selectedDateStr || "—"}
          </h3>
          {dayEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events for this day.</p>
          ) : (
            <div className="space-y-3">
              {dayEvents.map(e => (
                <div key={e.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-2 h-8 rounded-full ${eventTypeColors[e.type]}`} />
                  <div>
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.time || "All day"} • {e.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

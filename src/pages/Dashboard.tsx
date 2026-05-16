import { CheckSquare, Calendar, FolderOpen, TrendingUp, Clock, Target } from "lucide-react";
import StatCard from "@/components/StatCard";
import { weeklyData, subjectDistribution } from "@/lib/store";
import { useStore } from "@/lib/persistentStore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

const CHART_COLORS = ["#0C6478", "#09D1C7", "#213A58", "#54162B", "#15929B"];

const Dashboard = () => {
  const todos = useStore(s => s.todos);
  const assignments = useStore(s => s.assignments);
  const events = useStore(s => s.events);

  const today = new Date().toISOString().split("T")[0];
  const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const pendingTodos = todos.filter(t => !t.completed).length;
  const completedTodos = todos.filter(t => t.completed).length;
  const pendingAssignments = assignments.filter(a => a.status !== "completed").length;
  const upcomingEvents = events.filter(e => e.date >= today && e.date <= weekFromNow).length;

  const upcomingDeadlines = assignments
    .filter(a => a.status !== "completed" && a.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const todaysSchedule = events
    .filter(e => e.date === today)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));


  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your academic overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Tasks" value={pendingTodos} subtitle="Due this week" icon={CheckSquare} variant="primary" />
        <StatCard title="Completed" value={completedTodos} subtitle="Tasks done" icon={Target} trend="up" trendValue="20%" />
        <StatCard title="Assignments" value={pendingAssignments} subtitle="In progress" icon={FolderOpen} variant="accent" />
        <StatCard title="Events" value={upcomingEvents} subtitle="This week" icon={Calendar} variant="berry" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Tasks */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Weekly Task Progress</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 20% 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(213 20% 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(213 20% 46%)" />
              <Tooltip
                contentStyle={{
                  background: "hsl(0 0% 100%)",
                  border: "1px solid hsl(210 20% 90%)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="tasks" fill="#213A58" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="completed" fill="#09D1C7" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Distribution */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Subject Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={subjectDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {subjectDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming tasks & events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 && (
              <p className="text-sm text-muted-foreground">No pending deadlines. 🎉</p>
            )}
            {upcomingDeadlines.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.subject}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    a.priority === "high" ? "bg-destructive/10 text-destructive" :
                    a.priority === "medium" ? "bg-accent/10 text-accent" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {a.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" /> Today's Schedule
          </h3>
          <div className="space-y-3">
            {todaysSchedule.length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing scheduled for today.</p>
            )}
            {todaysSchedule.map(e => (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className={`w-2 h-8 rounded-full ${
                  e.type === "exam" ? "bg-destructive" :
                  e.type === "class" ? "bg-primary" :
                  e.type === "study" ? "bg-accent" :
                  "bg-muted-foreground"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.time || "All day"}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary font-medium capitalize">
                  {e.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

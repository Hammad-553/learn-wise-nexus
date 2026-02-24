import { weeklyData, subjectDistribution } from "@/lib/store";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from "recharts";

const COLORS = ["#0C6478", "#09D1C7", "#213A58", "#54162B", "#15929B"];

const assessmentData = [
  { week: "W1", score: 78 },
  { week: "W2", score: 82 },
  { week: "W3", score: 75 },
  { week: "W4", score: 88 },
  { week: "W5", score: 91 },
  { week: "W6", score: 85 },
  { week: "W7", score: 93 },
];

const skillData = [
  { subject: "Programming", A: 90, B: 75 },
  { subject: "Math", A: 78, B: 85 },
  { subject: "Physics", A: 70, B: 60 },
  { subject: "Writing", A: 85, B: 80 },
  { subject: "Research", A: 72, B: 68 },
];

const Analytics = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep insights into your academic performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly task chart with 3D-like perspective */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Weekly Task Completion</h3>
          <div style={{ perspective: "800px" }}>
            <div style={{ transform: "rotateX(10deg) rotateY(-5deg)", transformOrigin: "center center" }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData} barGap={4}>
                  <defs>
                    <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0C6478" />
                      <stop offset="100%" stopColor="#213A58" />
                    </linearGradient>
                    <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#09D1C7" />
                      <stop offset="100%" stopColor="#15929B" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 20% 90%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
                  <Bar dataKey="tasks" fill="url(#barGrad1)" radius={[6, 6, 0, 0]} name="Total" />
                  <Bar dataKey="completed" fill="url(#barGrad2)" radius={[6, 6, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Assessment Trend */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Assessment Score Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={assessmentData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#09D1C7" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#09D1C7" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 20% 90%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#0C6478" strokeWidth={2.5} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar skill chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Skill Assessment Radar</h3>
          <div style={{ perspective: "600px" }}>
            <div style={{ transform: "rotateX(5deg)", transformOrigin: "center center" }}>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillData}>
                  <PolarGrid stroke="hsl(210 20% 85%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Current" dataKey="A" stroke="#0C6478" fill="#0C6478" fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="Target" dataKey="B" stroke="#09D1C7" fill="#09D1C7" fillOpacity={0.15} strokeWidth={2} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Subject pie */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Time per Subject</h3>
          <div style={{ perspective: "600px" }}>
            <div style={{ transform: "rotateX(15deg)", transformOrigin: "center center" }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {subjectDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

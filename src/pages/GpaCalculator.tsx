import { useState } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";
import { Course, gradePoints } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GpaCalculator = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Data Structures", creditHours: 3, grade: "A" },
    { id: "2", name: "Physics II", creditHours: 4, grade: "B+" },
    { id: "3", name: "Calculus III", creditHours: 3, grade: "A-" },
  ]);

  const [semesters, setSemesters] = useState([
    { id: "1", name: "Semester 1", gpa: 3.5, credits: 15 },
    { id: "2", name: "Semester 2", gpa: 3.7, credits: 16 },
    { id: "3", name: "Semester 3", gpa: 3.4, credits: 15 },
  ]);

  const [percentage, setPercentage] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [obtainedMarks, setObtainedMarks] = useState("");

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: "", creditHours: 3, grade: "A" }]);
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const calculateGPA = () => {
    if (courses.length === 0) return 0;
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      const gp = gradePoints[c.grade] ?? 0;
      totalPoints += gp * c.creditHours;
      totalCredits += c.creditHours;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  };

  const calculateCGPA = () => {
    if (semesters.length === 0) return 0;
    let totalWeighted = 0;
    let totalCredits = 0;
    semesters.forEach(s => {
      totalWeighted += s.gpa * s.credits;
      totalCredits += s.credits;
    });
    return totalCredits > 0 ? (totalWeighted / totalCredits) : 0;
  };

  const calcPercentage = () => {
    const total = parseFloat(totalMarks);
    const obtained = parseFloat(obtainedMarks);
    if (total > 0 && obtained >= 0) {
      return ((obtained / total) * 100).toFixed(2);
    }
    return "—";
  };

  const gpa = calculateGPA();
  const cgpa = calculateCGPA();

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold">GPA & CGPA Calculator</h1>
        <p className="text-muted-foreground mt-1">Calculate your semester GPA, cumulative GPA, and percentages.</p>
      </div>

      <Tabs defaultValue="gpa" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="gpa">Semester GPA</TabsTrigger>
          <TabsTrigger value="cgpa">CGPA</TabsTrigger>
          <TabsTrigger value="percentage">Percentage</TabsTrigger>
        </TabsList>

        <TabsContent value="gpa">
          <div className="glass-card rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Current Semester Courses</h3>
              <Button onClick={addCourse} size="sm" className="gradient-accent text-secondary">
                <Plus className="w-4 h-4 mr-1" /> Add Course
              </Button>
            </div>
            <div className="space-y-3">
              {courses.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Input
                    placeholder="Course Name"
                    value={c.name}
                    onChange={e => updateCourse(c.id, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={1} max={6}
                    value={c.creditHours}
                    onChange={e => updateCourse(c.id, "creditHours", parseInt(e.target.value) || 1)}
                    className="w-20"
                    placeholder="Credits"
                  />
                  <Select value={c.grade} onValueChange={v => updateCourse(c.id, "grade", v)}>
                    <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(gradePoints).map(g => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button onClick={() => removeCourse(c.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl gradient-primary text-primary-foreground">
              <Calculator className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">Semester GPA</p>
                <p className="text-4xl font-bold">{gpa.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cgpa">
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h3 className="font-semibold">Semester-wise GPA</h3>
            <div className="space-y-3">
              {semesters.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium w-24">{s.name}</span>
                  <Input
                    type="number" step="0.01" min={0} max={4}
                    value={s.gpa}
                    onChange={e => {
                      const updated = [...semesters];
                      updated[i] = { ...s, gpa: parseFloat(e.target.value) || 0 };
                      setSemesters(updated);
                    }}
                    className="w-24"
                    placeholder="GPA"
                  />
                  <Input
                    type="number" min={1}
                    value={s.credits}
                    onChange={e => {
                      const updated = [...semesters];
                      updated[i] = { ...s, credits: parseInt(e.target.value) || 0 };
                      setSemesters(updated);
                    }}
                    className="w-24"
                    placeholder="Credits"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl gradient-berry text-primary-foreground">
              <Calculator className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">Cumulative GPA</p>
                <p className="text-4xl font-bold">{cgpa.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="percentage">
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h3 className="font-semibold">Percentage Calculator</h3>
            <div className="flex gap-3">
              <Input
                type="number" placeholder="Obtained Marks"
                value={obtainedMarks}
                onChange={e => setObtainedMarks(e.target.value)}
              />
              <Input
                type="number" placeholder="Total Marks"
                value={totalMarks}
                onChange={e => setTotalMarks(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl gradient-accent text-secondary">
              <Calculator className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">Percentage</p>
                <p className="text-4xl font-bold">{calcPercentage()}%</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GpaCalculator;

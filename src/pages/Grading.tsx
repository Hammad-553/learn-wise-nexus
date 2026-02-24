import { gradeScale } from "@/lib/store";

const Grading = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold">Grading Table</h1>
        <p className="text-muted-foreground mt-1">Standard university grading scale reference.</p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="gradient-primary text-primary-foreground">
              <th className="px-5 py-3.5 text-left text-sm font-semibold">Grade</th>
              <th className="px-5 py-3.5 text-left text-sm font-semibold">Percentage Range</th>
              <th className="px-5 py-3.5 text-left text-sm font-semibold">GPA Points</th>
              <th className="px-5 py-3.5 text-left text-sm font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {gradeScale.map((row, i) => (
              <tr
                key={row.grade}
                className={`border-b border-border transition-colors hover:bg-muted/50 ${
                  i % 2 === 0 ? "bg-card" : "bg-muted/20"
                }`}
              >
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm ${
                    row.gpa >= 3.7 ? "gradient-accent text-secondary" :
                    row.gpa >= 3.0 ? "bg-primary/10 text-primary" :
                    row.gpa >= 2.0 ? "bg-accent/10 text-accent" :
                    row.gpa >= 1.0 ? "bg-destructive/10 text-destructive" :
                    "bg-destructive/20 text-destructive"
                  }`}>
                    {row.grade}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm">{row.range}%</td>
                <td className="px-5 py-3 text-sm font-semibold">{row.gpa.toFixed(1)}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grading;

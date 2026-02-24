import { useState, useCallback } from "react";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  category: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  description?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "class" | "exam" | "assignment" | "study" | "other";
  time?: string;
}

export interface Course {
  id: string;
  name: string;
  creditHours: number;
  grade: string;
}

// Sample data
export const sampleTodos: Todo[] = [
  { id: "1", text: "Complete Data Structures Assignment", completed: false, priority: "high", dueDate: "2026-02-26", category: "CS301", createdAt: "2026-02-24" },
  { id: "2", text: "Read Chapter 5 - Algorithms", completed: true, priority: "medium", category: "CS301", createdAt: "2026-02-23" },
  { id: "3", text: "Prepare for Physics Lab", completed: false, priority: "medium", dueDate: "2026-02-25", category: "PHY201", createdAt: "2026-02-22" },
  { id: "4", text: "Submit Math Problem Set", completed: false, priority: "high", dueDate: "2026-02-27", category: "MATH301", createdAt: "2026-02-24" },
  { id: "5", text: "Review Database Notes", completed: true, priority: "low", category: "CS401", createdAt: "2026-02-21" },
];

export const sampleAssignments: Assignment[] = [
  { id: "1", title: "Binary Tree Implementation", subject: "Data Structures", dueDate: "2026-02-28", status: "in-progress", priority: "high", description: "Implement AVL tree with rotations" },
  { id: "2", title: "Lab Report - Optics", subject: "Physics", dueDate: "2026-03-02", status: "pending", priority: "medium" },
  { id: "3", title: "Linear Algebra Problem Set", subject: "Mathematics", dueDate: "2026-02-26", status: "pending", priority: "high" },
  { id: "4", title: "ER Diagram - Library System", subject: "Database Systems", dueDate: "2026-03-05", status: "pending", priority: "medium" },
  { id: "5", title: "Research Paper Review", subject: "Technical Writing", dueDate: "2026-03-01", status: "completed", priority: "low" },
];

export const sampleEvents: CalendarEvent[] = [
  { id: "1", title: "Data Structures Lecture", date: "2026-02-24", type: "class", time: "09:00" },
  { id: "2", title: "Physics Lab", date: "2026-02-25", type: "class", time: "14:00" },
  { id: "3", title: "Midterm - Algorithms", date: "2026-02-28", type: "exam", time: "10:00" },
  { id: "4", title: "Math Assignment Due", date: "2026-02-27", type: "assignment" },
  { id: "5", title: "Study Group - DB", date: "2026-02-26", type: "study", time: "16:00" },
];

export const weeklyData = [
  { day: "Mon", tasks: 8, completed: 6 },
  { day: "Tue", tasks: 5, completed: 4 },
  { day: "Wed", tasks: 7, completed: 7 },
  { day: "Thu", tasks: 6, completed: 3 },
  { day: "Fri", tasks: 9, completed: 5 },
  { day: "Sat", tasks: 4, completed: 4 },
  { day: "Sun", tasks: 3, completed: 2 },
];

export const subjectDistribution = [
  { name: "CS", value: 35 },
  { name: "Math", value: 25 },
  { name: "Physics", value: 20 },
  { name: "English", value: 12 },
  { name: "Other", value: 8 },
];

export const gradePoints: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

export const gradeScale = [
  { grade: "A+", range: "97-100", gpa: 4.0, description: "Exceptional" },
  { grade: "A", range: "93-96", gpa: 4.0, description: "Excellent" },
  { grade: "A-", range: "90-92", gpa: 3.7, description: "Very Good" },
  { grade: "B+", range: "87-89", gpa: 3.3, description: "Good" },
  { grade: "B", range: "83-86", gpa: 3.0, description: "Above Average" },
  { grade: "B-", range: "80-82", gpa: 2.7, description: "Satisfactory" },
  { grade: "C+", range: "77-79", gpa: 2.3, description: "Fair" },
  { grade: "C", range: "73-76", gpa: 2.0, description: "Adequate" },
  { grade: "C-", range: "70-72", gpa: 1.7, description: "Below Average" },
  { grade: "D+", range: "67-69", gpa: 1.3, description: "Poor" },
  { grade: "D", range: "63-66", gpa: 1.0, description: "Very Poor" },
  { grade: "D-", range: "60-62", gpa: 0.7, description: "Minimal Pass" },
  { grade: "F", range: "0-59", gpa: 0.0, description: "Fail" },
];

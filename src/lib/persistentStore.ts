import { useSyncExternalStore } from "react";
import { Todo, Assignment, CalendarEvent, sampleTodos, sampleAssignments, sampleEvents } from "./store";

type Store = {
  todos: Todo[];
  assignments: Assignment[];
  events: CalendarEvent[];
};

const KEY = "academix_store_v1";

const load = (): Store => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { todos: sampleTodos, assignments: sampleAssignments, events: sampleEvents };
};

let state: Store = load();
const listeners = new Set<() => void>();

const persist = () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
};

const setState = (updater: (s: Store) => Store) => {
  state = updater(state);
  persist();
  listeners.forEach(l => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => { listeners.delete(l); };
};

// Cross-tab sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      state = load();
      listeners.forEach(l => l());
    }
  });
}

export const useStore = <T,>(selector: (s: Store) => T): T =>
  useSyncExternalStore(subscribe, () => selector(state), () => selector(state));

export const storeActions = {
  setTodos: (todos: Todo[] | ((t: Todo[]) => Todo[])) =>
    setState(s => ({ ...s, todos: typeof todos === "function" ? (todos as any)(s.todos) : todos })),
  setAssignments: (a: Assignment[] | ((a: Assignment[]) => Assignment[])) =>
    setState(s => ({ ...s, assignments: typeof a === "function" ? (a as any)(s.assignments) : a })),
  setEvents: (e: CalendarEvent[] | ((e: CalendarEvent[]) => CalendarEvent[])) =>
    setState(s => ({ ...s, events: typeof e === "function" ? (e as any)(s.events) : e })),
};

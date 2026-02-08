
import { Injectable, signal, computed, effect } from '@angular/core';

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Workout {
  id: string;
  categoryId: string;
  name: string;
  image?: string; // Base64 or URL
}

export interface Log {
  id: string;
  workoutId: string;
  date: string; // ISO string
  weight: number;
  reps: number;
  sets: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Initial State
  private readonly STORAGE_KEY = 'gym_tracker_data_v1';
  
  // Default Categories
  private defaultCategories: Category[] = [
    { id: 'chest', name: 'Chest', image: 'https://picsum.photos/id/34/400/300' },
    { id: 'back', name: 'Back', image: 'https://picsum.photos/id/65/400/300' },
    { id: 'legs', name: 'Legs', image: 'https://picsum.photos/id/75/400/300' },
    { id: 'shoulders', name: 'Shoulders', image: 'https://picsum.photos/id/88/400/300' },
    { id: 'biceps', name: 'Biceps', image: 'https://picsum.photos/id/99/400/300' },
    { id: 'triceps', name: 'Triceps', image: 'https://picsum.photos/id/102/400/300' },
    { id: 'abs', name: 'Abs', image: 'https://picsum.photos/id/120/400/300' },
    { id: 'cardio', name: 'Cardio', image: 'https://picsum.photos/id/130/400/300' },
  ];

  // Signals
  categories = signal<Category[]>(this.defaultCategories);
  workouts = signal<Workout[]>([]);
  logs = signal<Log[]>([]);

  constructor() {
    this.loadData();

    // Persist effect
    effect(() => {
      const data = {
        workouts: this.workouts(),
        logs: this.logs()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    });
  }

  private loadData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.workouts.set(parsed.workouts || []);
        this.logs.set(parsed.logs || []);
      } catch (e) {
        console.error('Failed to parse local data', e);
      }
    } else {
      // Seed some initial workouts for demo
      this.workouts.set([
        { id: 'w1', categoryId: 'chest', name: 'Bench Press', image: 'https://picsum.photos/id/1/400/300' },
        { id: 'w2', categoryId: 'legs', name: 'Squat', image: 'https://picsum.photos/id/2/400/300' }
      ]);
    }
  }

  getWorkoutsByCategory(categoryId: string) {
    return computed(() => this.workouts().filter(w => w.categoryId === categoryId));
  }

  getLogsByWorkoutId(workoutId: string) {
    return computed(() => 
      this.logs()
        .filter(l => l.workoutId === workoutId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }

  getWorkoutById(id: string): Workout | undefined {
    return this.workouts().find(w => w.id === id);
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories().find(c => c.id === id);
  }

  addWorkout(workout: Omit<Workout, 'id'>) {
    const newWorkout: Workout = {
      ...workout,
      id: crypto.randomUUID()
    };
    this.workouts.update(ws => [...ws, newWorkout]);
  }

  addLog(log: Omit<Log, 'id'>) {
    const newLog: Log = {
      ...log,
      id: crypto.randomUUID()
    };
    this.logs.update(ls => [...ls, newLog]);
  }

  deleteLog(id: string) {
    this.logs.update(ls => ls.filter(l => l.id !== id));
  }
}

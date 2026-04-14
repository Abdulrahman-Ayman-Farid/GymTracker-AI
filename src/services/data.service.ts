
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

export interface Routine {
  id: string;
  name: string;
  description: string;
  workoutIds: string[];
}

export interface Log {
  id: string;
  workoutId: string;
  date: string; // ISO string
  weight: number;
  reps: number;
  sets: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  restTime?: number; // Rest time in seconds
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
    { id: 'chest', name: 'Chest', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop' },
    { id: 'back', name: 'Back', image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=400&h=300&fit=crop' },
    { id: 'legs', name: 'Legs', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop' },
    { id: 'shoulders', name: 'Shoulders', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop' },
    { id: 'biceps', name: 'Biceps', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop' },
    { id: 'triceps', name: 'Triceps', image: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&h=300&fit=crop' },
    { id: 'abs', name: 'Abs', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
    { id: 'cardio', name: 'Cardio', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop' },
  ];

  // Signals
  categories = signal<Category[]>(this.defaultCategories);
  workouts = signal<Workout[]>([]);
  routines = signal<Routine[]>([]);
  logs = signal<Log[]>([]);

  constructor() {
    this.loadData();

    // Persist effect
    effect(() => {
      const data = {
        workouts: this.workouts(),
        routines: this.routines(),
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
        this.routines.set(parsed.routines || []);
        this.logs.set(parsed.logs || []);
      } catch (e) {
        console.error('Failed to parse local data', e);
      }
    } else {
      // Seed some initial workouts for demo
      this.workouts.set([
        { id: 'w1', categoryId: 'chest', name: 'Bench Press', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop' },
        { id: 'w2', categoryId: 'legs', name: 'Squat', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop' },
        { id: 'w3', categoryId: 'back', name: 'Pull-ups', image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=400&h=300&fit=crop' },
        { id: 'w4', categoryId: 'shoulders', name: 'Overhead Press', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop' }
      ]);
      
      this.routines.set([
        { id: 'r1', name: 'Push Day', description: 'Chest, Shoulders, Triceps', workoutIds: ['w1', 'w4'] },
        { id: 'r2', name: 'Pull Day', description: 'Back, Biceps', workoutIds: ['w3'] },
        { id: 'r3', name: 'Leg Day', description: 'Quads, Hamstrings, Calves', workoutIds: ['w2'] }
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

  getRoutineById(id: string): Routine | undefined {
    return this.routines().find(r => r.id === id);
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

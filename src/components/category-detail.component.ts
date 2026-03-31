
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DataService, Category } from '../services/data.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#0a0a0a] pb-20">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-4">
        <a routerLink="/home" class="p-2 rounded-full hover:bg-white/5 text-neutral-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
        <h1 class="text-xl font-bold text-white tracking-tight">{{ category()?.name }} Workouts</h1>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-4">
        @if (workouts().length === 0) {
          <div class="text-center py-16 px-4 rounded-[1.5rem] border border-dashed border-white/10 bg-[#141414]/50">
            <p class="text-neutral-500 mb-6 font-light">No workouts here yet.</p>
            <button (click)="isAdding.set(true)" class="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-medium rounded-full transition-colors">
              Add First Workout
            </button>
          </div>
        }

        @for (workout of workouts(); track workout.id) {
          <a [routerLink]="['/workout', workout.id]" 
             class="flex items-center gap-4 p-4 bg-[#141414] rounded-[1.5rem] border border-white/5 hover:border-white/10 active:bg-white/5 transition-all shadow-sm">
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-[#0a0a0a] flex-shrink-0 relative border border-white/5">
               @if (workout.image) {
                 <img [src]="workout.image" class="w-full h-full object-cover" alt="Workout">
               } @else {
                 <div class="w-full h-full flex items-center justify-center text-neutral-600">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                 </div>
               }
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-medium text-white truncate">{{ workout.name }}</h3>
              <p class="text-sm text-neutral-500 font-light mt-0.5">Tap to track progress</p>
            </div>
            <div class="text-neutral-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </a>
        }
      </div>

      <!-- Floating Action Button -->
      <button (click)="isAdding.set(true)" 
              class="fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-lg shadow-white/10 flex items-center justify-center hover:bg-neutral-200 active:scale-90 transition-all z-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      </button>

      <!-- Add Workout Modal/Overlay -->
      @if (isAdding()) {
        <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div class="bg-[#141414] w-full max-w-sm rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
            <div class="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 class="text-lg font-bold text-white tracking-tight">New {{ category()?.name }} Workout</h2>
              <button (click)="isAdding.set(false)" class="text-neutral-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <form [formGroup]="addForm" (ngSubmit)="submitWorkout()" class="p-6 space-y-5">
              <div>
                <label class="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest font-mono">Workout Name</label>
                <input type="text" formControlName="name" placeholder="e.g. Incline Bench" 
                       class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white placeholder-neutral-600 focus:border-brand-500 focus:outline-none transition-colors">
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest font-mono">Photo (Optional)</label>
                <div class="relative">
                  <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" class="hidden">
                  <button type="button" (click)="fileInput.click()" 
                          class="w-full h-32 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-neutral-500 hover:border-brand-500/50 hover:bg-white/5 transition-all">
                    @if (previewImage()) {
                      <img [src]="previewImage()" class="w-full h-full object-cover rounded-xl">
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      <span class="text-sm font-light">Tap to upload</span>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" [disabled]="addForm.invalid" 
                      class="w-full bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium py-4 rounded-xl transition-all mt-2">
                Create Workout
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-fade-in { animation: fade-in 0.2s ease-out; }
  `]
})
export class CategoryDetailComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private fb = inject(FormBuilder);
  
  categoryId = signal<string>('');
  category = computed(() => this.dataService.getCategoryById(this.categoryId()));
  workouts = computed(() => this.dataService.getWorkoutsByCategory(this.categoryId())());
  
  isAdding = signal(false);
  previewImage = signal<string | null>(null);

  addForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.categoryId.set(params['id']);
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  submitWorkout() {
    if (this.addForm.valid && this.categoryId()) {
      this.dataService.addWorkout({
        categoryId: this.categoryId(),
        name: this.addForm.value.name!,
        image: this.previewImage() || undefined
      });
      this.isAdding.set(false);
      this.addForm.reset();
      this.previewImage.set(null);
    }
  }
}

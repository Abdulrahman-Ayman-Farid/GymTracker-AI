
import { Component, inject, computed, signal, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService, Log } from '../services/data.service';
import { GeminiService } from '../services/gemini.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import * as d3 from 'd3';

@Component({
  selector: 'app-workout-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#0a0a0a] pb-20">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
           <a [routerLink]="['/category', workout()?.categoryId]" class="p-2 rounded-full hover:bg-white/5 text-neutral-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </a>
          <h1 class="text-xl font-bold text-white truncate max-w-[200px] tracking-tight">{{ workout()?.name }}</h1>
        </div>
        
        <button (click)="askAi()" [disabled]="isLoadingAi()" 
                class="bg-white text-black text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50">
          @if (isLoadingAi()) {
             <svg class="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          } @else {
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c3.2 0 5.2 2.3 6 4"/></svg>
          }
          Coach
        </button>
      </div>

      <div class="p-4 space-y-6">
        <!-- AI Advice Box -->
        @if (aiAdvice()) {
          <div class="bg-[#141414] border border-brand-500/30 p-5 rounded-2xl animate-fade-in relative shadow-lg shadow-brand-500/5">
            <button (click)="aiAdvice.set(null)" class="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div class="flex gap-4">
              <div class="bg-brand-500/10 p-2.5 rounded-xl h-fit text-brand-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p class="text-sm text-neutral-300 leading-relaxed font-light">{{ aiAdvice() }}</p>
            </div>
          </div>
        }

        <!-- Chart Section -->
        <div class="bg-[#141414] rounded-[1.5rem] p-5 border border-white/5 shadow-sm">
           <div class="flex justify-between items-center mb-6">
             <h3 class="text-neutral-400 text-xs font-medium uppercase tracking-widest font-mono">Progress Chart</h3>
             <!-- Legend -->
             <div class="flex gap-4 text-[10px] font-mono uppercase tracking-wider">
               <div class="flex items-center gap-1.5">
                 <span class="w-3 h-1 bg-brand-500 rounded-full"></span>
                 <span class="text-brand-400">Weight</span>
               </div>
               <div class="flex items-center gap-1.5">
                 <span class="w-3 h-1 bg-neutral-400 border border-neutral-400" style="border-style: dashed;"></span>
                 <span class="text-neutral-400">Reps</span>
               </div>
               <div class="flex items-center gap-1.5">
                 <span class="w-3 h-3 bg-white/5 border border-white/20 rounded-sm"></span>
                 <span class="text-neutral-400">Sets</span>
               </div>
             </div>
           </div>
           <div class="w-full h-56 relative" #chartContainer></div>
        </div>

        <!-- Recent Logs -->
        <div>
           <div class="flex justify-between items-center mb-5">
             <h3 class="text-white font-bold text-lg tracking-tight">History</h3>
             <span class="text-xs text-neutral-500 bg-white/5 px-2.5 py-1 rounded-md font-mono">{{ logs().length }} entries</span>
           </div>

           <div class="space-y-3">
             @for (log of logs(); track log.id) {
               <div class="bg-[#141414] p-5 rounded-2xl border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                 <div>
                   <div class="flex items-baseline gap-2">
                     <span class="text-3xl font-light text-brand-400">{{ log.weight }}<span class="text-sm font-mono text-neutral-500 ml-0.5">kg</span></span>
                     <span class="text-neutral-600 font-light">×</span>
                     <span class="text-xl font-medium text-white">{{ log.reps }}<span class="text-sm font-mono text-neutral-500 ml-0.5">reps</span></span>
                     <span class="text-neutral-600 font-light">×</span>
                     <span class="text-xl font-medium text-white">{{ log.sets }}<span class="text-sm font-mono text-neutral-500 ml-0.5">sets</span></span>
                   </div>
                   <div class="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mt-3 flex flex-wrap gap-2 items-center">
                      <span class="bg-white/5 px-2 py-1 rounded-md text-neutral-400">Vol: {{ calculateVolume(log.weight, log.reps, log.sets) }}kg</span>
                      <span class="bg-white/5 px-2 py-1 rounded-md text-neutral-400">1RM: ~{{ calculate1RM(log.weight, log.reps) }}kg</span>
                      @if (log.rpe) {
                        <span class="bg-brand-500/10 text-brand-400 px-2 py-1 rounded-md">RPE {{ log.rpe }}</span>
                      }
                      @if (log.restTime) {
                        <span class="bg-white/5 px-2 py-1 rounded-md text-neutral-400">{{ log.restTime }}s rest</span>
                      }
                      <span class="text-neutral-600 ml-auto">{{ formatDate(log.date) }}</span>
                   </div>
                   @if (log.notes) {
                     <p class="text-sm text-neutral-400 mt-3 font-light border-l-2 border-white/10 pl-3">"{{ log.notes }}"</p>
                   }
                 </div>
                 <button (click)="deleteLog(log.id)" class="p-3 text-neutral-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                 </button>
               </div>
             }
             @if (logs().length === 0) {
               <div class="text-center py-12 text-neutral-500 font-light bg-[#141414]/50 rounded-2xl border border-dashed border-white/10">
                 No logs yet. Start lifting!
               </div>
             }
           </div>
        </div>
      </div>

      <!-- Log Button -->
      <button (click)="isLogging.set(true)" 
              class="fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-lg shadow-white/10 flex items-center justify-center hover:bg-neutral-200 active:scale-90 transition-all z-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      </button>

      <!-- Logging Modal -->
      @if (isLogging()) {
        <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div class="bg-[#141414] w-full max-w-sm rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
            <div class="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 class="text-lg font-bold text-white tracking-tight">Log Set</h2>
              <button (click)="isLogging.set(false)" class="text-neutral-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <form [formGroup]="logForm" (ngSubmit)="submitLog()" class="p-6 space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest font-mono">Weight (KG)</label>
                  <input type="number" formControlName="weight" class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white text-center text-xl font-light focus:border-brand-500 focus:outline-none transition-colors">
                </div>
                <div>
                  <label class="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest font-mono">Reps</label>
                  <input type="number" formControlName="reps" class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white text-center text-xl font-light focus:border-brand-500 focus:outline-none transition-colors">
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest font-mono">Sets</label>
                <div class="flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl p-1.5">
                  <button type="button" (click)="adjustSets(-1)" class="p-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                  </button>
                  <span class="flex-1 text-center font-medium text-white text-xl">{{ logForm.get('sets')?.value }}</span>
                  <button type="button" (click)="adjustSets(1)" class="p-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest font-mono">RPE (1-10)</label>
                  <input type="number" formControlName="rpe" min="1" max="10" class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white text-center text-xl font-light focus:border-brand-500 focus:outline-none transition-colors">
                </div>
                <div>
                  <label class="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest font-mono">Rest (sec)</label>
                  <input type="number" formControlName="restTime" class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white text-center text-xl font-light focus:border-brand-500 focus:outline-none transition-colors">
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest font-mono">Notes (Optional)</label>
                <textarea formControlName="notes" rows="2" class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white focus:border-brand-500 focus:outline-none transition-colors font-light"></textarea>
              </div>

              <button type="submit" [disabled]="logForm.invalid" 
                      class="w-full bg-white hover:bg-neutral-200 text-black font-medium py-4 rounded-xl transition-all disabled:opacity-50 mt-2">
                Save Log
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-fade-in { animation: fade-in 0.2s ease-out; }
  `]
})
export class WorkoutDetailComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private geminiService = inject(GeminiService);
  private fb = inject(FormBuilder);

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  workoutId = signal<string>('');
  workout = computed(() => this.dataService.getWorkoutById(this.workoutId()));
  logs = computed(() => this.dataService.getLogsByWorkoutId(this.workoutId())());
  
  isLogging = signal(false);
  isLoadingAi = signal(false);
  aiAdvice = signal<string | null>(null);

  logForm = this.fb.group({
    weight: [0, [Validators.required, Validators.min(1)]],
    reps: [0, [Validators.required, Validators.min(1)]],
    sets: [3, [Validators.required, Validators.min(1)]],
    rpe: [8, [Validators.min(1), Validators.max(10)]],
    restTime: [90, [Validators.min(0)]],
    notes: ['']
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.workoutId.set(params['id']);
      this.getLastLog(); // Pre-fill with last values
    });

    effect(() => {
      // Re-draw chart when logs change
      const currentLogs = this.logs();
      if (this.chartContainer && currentLogs.length > 0) {
        this.renderChart(currentLogs);
      }
    });
  }

  getLastLog() {
    const logs = this.logs();
    if (logs.length > 0) {
      const last = logs[0]; // Sorted by date desc
      this.logForm.patchValue({
        weight: last.weight,
        reps: last.reps,
        sets: last.sets,
        rpe: last.rpe || 8,
        restTime: last.restTime || 90
      });
    }
  }

  adjustSets(delta: number) {
    const current = this.logForm.get('sets')?.value || 0;
    const newVal = Math.max(1, current + delta);
    this.logForm.get('sets')?.setValue(newVal);
  }

  submitLog() {
    if (this.logForm.valid && this.workoutId()) {
      this.dataService.addLog({
        workoutId: this.workoutId(),
        date: new Date().toISOString(),
        weight: this.logForm.value.weight!,
        reps: this.logForm.value.reps!,
        sets: this.logForm.value.sets!,
        rpe: this.logForm.value.rpe || undefined,
        restTime: this.logForm.value.restTime || undefined,
        notes: this.logForm.value.notes || undefined
      });
      this.isLogging.set(false);
      this.aiAdvice.set(null); // Clear old advice on new log
    }
  }

  calculate1RM(weight: number, reps: number): number {
    return Math.round(weight * (1 + reps / 30));
  }

  calculateVolume(weight: number, reps: number, sets: number): number {
    return weight * reps * sets;
  }

  deleteLog(id: string) {
    if (confirm('Delete this log?')) {
      this.dataService.deleteLog(id);
    }
  }

  formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  async askAi() {
    const w = this.workout();
    const l = this.logs();
    if (!w) return;

    this.isLoadingAi.set(true);
    const advice = await this.geminiService.getWorkoutAnalysis(w, l);
    this.aiAdvice.set(advice);
    this.isLoadingAi.set(false);
  }

  // D3 Chart Rendering
  renderChart(data: Log[]) {
    // Sort chronological for chart
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Clear previous
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();

    const margin = { top: 20, right: 40, bottom: 30, left: 40 }; 
    const width = this.chartContainer.nativeElement.clientWidth - margin.left - margin.right;
    const height = 224 - margin.top - margin.bottom; // h-56 is 224px

    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Axis
    const x = d3.scaleTime()
      .domain(d3.extent(sortedData, d => new Date(d.date)) as [Date, Date])
      .range([0, width]);

    // Y Axis Left (Weight)
    const yWeight = d3.scaleLinear()
      .domain([0, (d3.max(sortedData, d => d.weight) || 100) * 1.1])
      .range([height, 0]);

    // Y Axis Right (Reps)
    const yReps = d3.scaleLinear()
      .domain([0, (d3.max(sortedData, d => d.reps) || 20) * 1.2]) 
      .range([height, 0]);

    // Y Scale for Sets Bars (Background)
    const ySets = d3.scaleLinear()
      .domain([0, (d3.max(sortedData, d => d.sets) || 5) * 1.2])
      .range([0, height * 0.4]); 

    // Draw Sets Bars
    svg.selectAll('.bar-sets')
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('x', d => x(new Date(d.date)) - 6) // Center 12px bar
      .attr('y', d => height - ySets(d.sets))
      .attr('width', 12)
      .attr('height', d => ySets(d.sets))
      .attr('fill', '#334155') // slate-700
      .attr('opacity', 0.5)
      .attr('rx', 2);

    // Draw Sets Labels
    svg.selectAll('.label-sets')
      .data(sortedData)
      .enter()
      .append('text')
      .attr('x', d => x(new Date(d.date)))
      .attr('y', d => height - ySets(d.sets) - 4)
      .text(d => d.sets)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8') // slate-400
      .style('font-size', '9px')
      .style('font-weight', 'bold');

    // Lines
    const lineWeight = d3.line<Log>()
      .x(d => x(new Date(d.date)))
      .y(d => yWeight(d.weight))
      .curve(d3.curveMonotoneX);

    const lineReps = d3.line<Log>()
      .x(d => x(new Date(d.date)))
      .y(d => yReps(d.reps))
      .curve(d3.curveMonotoneX);

    // Draw Left Axis (Weight - Brand)
    svg.append('g')
       .call(d3.axisLeft(yWeight).ticks(5))
       .attr('color', '#22c55e') // brand-500
       .style('font-size', '10px');

    // Draw Right Axis (Reps - Neutral)
    svg.append('g')
       .attr('transform', `translate(${width},0)`)
       .call(d3.axisRight(yReps).ticks(5))
       .attr('color', '#a3a3a3') // neutral-400
       .style('font-size', '10px');

    // Draw X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat((d) => d3.timeFormat('%b %d')(d as Date)))
      .attr('color', '#525252') // neutral-600
      .style('font-size', '10px');

    // Add Grid (based on weight)
    svg.append('g')
       .attr('class', 'grid')
       .attr('opacity', 0.1)
       .call(d3.axisLeft(yWeight).tickSize(-width).tickFormat(() => ''));

    // Draw Reps Line (Back layer, dashed)
    svg.append('path')
      .datum(sortedData)
      .attr('fill', 'none')
      .attr('stroke', '#a3a3a3') // neutral-400
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4 4')
      .attr('d', lineReps)
      .attr('opacity', 0.8);

    // Draw Weight Line (Front layer, solid)
    svg.append('path')
      .datum(sortedData)
      .attr('fill', 'none')
      .attr('stroke', '#22c55e') // brand-500
      .attr('stroke-width', 3)
      .attr('d', lineWeight);

    // Draw Reps Dots
    svg.selectAll('.dot-reps')
      .data(sortedData)
      .enter()
      .append('circle')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => yReps(d.reps))
      .attr('r', 3)
      .attr('fill', '#171717') // neutral-900 background
      .attr('stroke', '#a3a3a3'); // neutral-400 border

    // Draw Weight Dots
    svg.selectAll('.dot-weight')
      .data(sortedData)
      .enter()
      .append('circle')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => yWeight(d.weight))
      .attr('r', 4)
      .attr('fill', '#052e16') // brand-950
      .attr('stroke', '#22c55e') // brand-500 border
      .attr('stroke-width', 2);
  }
}

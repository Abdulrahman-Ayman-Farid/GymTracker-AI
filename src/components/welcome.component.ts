
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a] text-center relative overflow-hidden">
      
      <!-- Decorative background elements -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div class="space-y-10 max-w-sm z-10 flex flex-col items-center">
        <!-- Logo Icon -->
        <div class="flex items-center justify-center w-24 h-24 rounded-[2rem] bg-[#141414] border border-white/5 shadow-2xl relative group">
          <div class="absolute inset-0 bg-brand-500/10 blur-xl rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-400">
            <path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6 20v-2a6 6 0 1 1 12 0v2"/><path d="M6 4v2a6 6 0 1 0 12 0V4"/>
          </svg>
        </div>

        <div>
          <h1 class="text-5xl font-bold tracking-tight text-white mb-3">
            GymTracker
          </h1>
          <p class="text-neutral-400 text-lg leading-relaxed font-light">
            Track lifts. Visualize progress. <br/> Get expert AI coaching.
          </p>
        </div>

        <div class="w-full pt-8 space-y-6">
          <a routerLink="/home" class="group relative block w-full py-4 px-6 bg-white hover:bg-neutral-200 text-black font-medium text-lg rounded-full transition-all active:scale-95 overflow-hidden">
             Start Training
          </a>
          
          <div class="grid grid-cols-3 gap-2 text-xs text-neutral-500 font-medium tracking-wide uppercase">
            <div class="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-400"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              <span>Charts</span>
            </div>
             <div class="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-400"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c3.2 0 5.2 2.3 6 4"/></svg>
              <span>AI Coach</span>
            </div>
             <div class="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-400"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              <span>Logs</span>
            </div>
          </div>
        </div>
        
        <p class="text-[10px] text-neutral-600 absolute bottom-8 uppercase tracking-widest font-mono">
          Local Storage • Privacy Focused
        </p>
      </div>
    </div>
  `
})
export class WelcomeComponent {}

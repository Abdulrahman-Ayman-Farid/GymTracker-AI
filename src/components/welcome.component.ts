
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="h-full flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-center relative overflow-hidden">
      
      <!-- Decorative background elements -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

      <div class="space-y-8 max-w-sm z-10 flex flex-col items-center">
        <!-- Logo Icon -->
        <div class="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl shadow-emerald-500/10 mb-2 relative group">
          <div class="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#34d399" />
                <stop offset="100%" stop-color="#22d3ee" />
              </linearGradient>
            </defs>
            <path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6 20v-2a6 6 0 1 1 12 0v2"/><path d="M6 4v2a6 6 0 1 0 12 0V4"/>
          </svg>
        </div>

        <div>
          <h1 class="text-4xl font-extrabold tracking-tight text-white mb-2">
            GymTracker <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AI</span>
          </h1>
          <p class="text-slate-400 text-lg leading-relaxed">
            Track lifts. Visualize progress. <br/> Get expert AI coaching.
          </p>
        </div>

        <div class="w-full pt-4 space-y-4">
          <a routerLink="/home" class="group relative block w-full py-4 px-6 bg-slate-200 hover:bg-white text-slate-900 font-bold text-lg rounded-2xl shadow-xl shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95 overflow-hidden">
             <div class="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
             Start Training
          </a>
          
          <div class="grid grid-cols-3 gap-2 text-xs text-slate-500 font-medium">
            <div class="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              <span>Charts</span>
            </div>
             <div class="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c3.2 0 5.2 2.3 6 4"/></svg>
              <span>AI Coach</span>
            </div>
             <div class="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              <span>Logs</span>
            </div>
          </div>
        </div>
        
        <p class="text-[10px] text-slate-600 absolute bottom-6">
          Local Storage • Privacy Focused
        </p>
      </div>
    </div>
  `
})
export class WelcomeComponent {}

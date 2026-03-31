
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="max-w-md mx-auto h-full bg-[#0a0a0a] flex flex-col shadow-2xl relative font-sans text-neutral-200">
      <main class="flex-1 overflow-y-auto overflow-x-hidden">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}

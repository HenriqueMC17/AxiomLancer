import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <!-- Router Outlet Principal -->
    <router-outlet></router-outlet>

    <!-- Toasts Flutuantes Globais via Signals -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-2xl font-mono text-xs animate-in slide-in-from-bottom-2 duration-200"
          [ngClass]="{
            'bg-[#064e3b] border-emerald-500/50 text-emerald-100': toast.type === 'success',
            'bg-[#881337] border-rose-500/50 text-rose-100': toast.type === 'alert',
            'bg-[#0f172a] border-cyan-500/50 text-cyan-100': toast.type === 'info'
          }">
          <div class="flex items-center gap-2">
            @if (toast.type === 'success') { <span>✓</span> }
            @else if (toast.type === 'alert') { <span>⚠</span> }
            @else { <span>ℹ</span> }
            <span>{{ toast.message }}</span>
          </div>
          <button (click)="toastService.remove(toast.id)" class="text-white/60 hover:text-white cursor-pointer ml-2">✕</button>
        </div>
      }
    </div>
  `,
  styleUrl: './app.css',
})
export class App {
  public toastService = inject(ToastService);
}

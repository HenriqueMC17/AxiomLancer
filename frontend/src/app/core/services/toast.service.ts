import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'alert' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public toasts = signal<Toast[]>([]);

  public show(message: string, type: 'success' | 'alert' | 'info' = 'success', durationMs = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type };

    this.toasts.update((current) => [...current, toast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  public remove(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}

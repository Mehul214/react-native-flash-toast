import type { FlashMessageOptions, FlashMessageRef } from './types';

class FlashMessageManager {
  private defaultInstance: FlashMessageRef | null = null;
  private instances: Map<string, FlashMessageRef> = new Map();
  private pendingQueue: FlashMessageOptions[] = [];

  public register(ref: FlashMessageRef, id: string = 'default'): void {
    this.instances.set(id, ref);
    if (!this.defaultInstance || id === 'default') {
      this.defaultInstance = ref;
    }

    // Flush any pending messages that arrived before mount
    if (this.pendingQueue.length > 0) {
      const next = this.pendingQueue.shift();
      if (next) {
        ref.showMessage(next);
      }
    }
  }

  public unregister(id: string = 'default'): void {
    this.instances.delete(id);
    if (this.defaultInstance === this.instances.get(id)) {
      this.defaultInstance = this.instances.values().next().value || null;
    }
  }

  public showMessage(options: FlashMessageOptions, targetId?: string): void {
    const target = targetId ? this.instances.get(targetId) : this.defaultInstance;

    if (target) {
      target.showMessage(options);
    } else {
      // Buffer if component hasn't mounted yet
      this.pendingQueue.push(options);
    }
  }

  public hideMessage(targetId?: string): void {
    const target = targetId ? this.instances.get(targetId) : this.defaultInstance;
    if (target) {
      target.hideMessage();
    }
  }
}

export const flashManager = new FlashMessageManager();

/**
 * Imperative helper to trigger a flash message from anywhere in the app
 * (services, Zustand, Redux, API handlers, navigation screens).
 */
export function showMessage(options: FlashMessageOptions): void {
  flashManager.showMessage(options);
}

/**
 * Imperative helper to dismiss the currently displayed flash message.
 */
export function hideMessage(): void {
  flashManager.hideMessage();
}

/**
 * Modern alias for showMessage
 */
export const flash = showMessage;
export const dismissFlash = hideMessage;


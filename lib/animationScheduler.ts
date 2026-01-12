/**
 * Unified Animation Scheduler
 *
 * Centralized requestAnimationFrame manager to synchronize all animations
 * in a single frame loop, preventing multiple RAF conflicts and improving performance.
 *
 * Benefits:
 * - Single RAF loop for entire app (instead of 3+ separate loops)
 * - Better frame synchronization across all animations
 * - Automatic cleanup and subscription management
 * - Precise delta time calculations
 * - Pause/resume capabilities for performance gating
 */

type AnimationCallback = (time: number, delta: number) => void;

export class AnimationScheduler {
  private callbacks = new Map<string, AnimationCallback>();
  private rafId: number | null = null;
  private lastTime = 0;
  private isRunning = false;

  /**
   * Main animation loop - syncs all registered animations to one frame
   */
  private tick = (time: number) => {
    const delta = this.lastTime ? time - this.lastTime : 16.67; // Default to ~60fps
    this.lastTime = time;

    // Execute all registered animation callbacks in sync
    this.callbacks.forEach((callback) => {
      try {
        callback(time, delta);
      } catch (error) {
        console.error('[AnimationScheduler] Callback error:', error);
      }
    });

    if (this.isRunning) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  /**
   * Subscribe an animation callback to the unified scheduler
   *
   * @param id - Unique identifier for this animation
   * @param callback - Function to call each frame with (time, delta)
   * @returns Unsubscribe function
   */
  subscribe(id: string, callback: AnimationCallback) {
    this.callbacks.set(id, callback);

    // Start the loop if this is the first subscription
    if (!this.isRunning) {
      this.start();
    }

    // Return cleanup function
    return () => {
      this.callbacks.delete(id);
      // Stop loop if no more subscribers
      if (this.callbacks.size === 0) {
        this.stop();
      }
    };
  }

  /**
   * Pause a specific animation without removing it
   */
  pause(id: string) {
    const callback = this.callbacks.get(id);
    if (callback) {
      this.callbacks.delete(id);
      return callback;
    }
    return null;
  }

  /**
   * Resume a paused animation
   */
  resume(id: string, callback: AnimationCallback) {
    this.callbacks.set(id, callback);
    if (!this.isRunning && this.callbacks.size > 0) {
      this.start();
    }
  }

  /**
   * Start the animation loop
   */
  private start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = 0; // Reset timing
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  /**
   * Stop the animation loop
   */
  private stop() {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lastTime = 0;
  }

  /**
   * Get current stats for debugging
   */
  getStats() {
    return {
      activeCallbacks: this.callbacks.size,
      isRunning: this.isRunning,
      registeredIds: Array.from(this.callbacks.keys()),
    };
  }

  /**
   * Manually stop all animations (for cleanup)
   */
  destroy() {
    this.stop();
    this.callbacks.clear();
  }
}

// Global singleton instance
export const globalScheduler = new AnimationScheduler();

// Debug helper (remove in production)
if (typeof window !== 'undefined') {
  (window as any).__animationScheduler = globalScheduler;
}

export class RateLimiter {
  private timestamps: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 60, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Checks if a request is allowed and records the timestamp if it is.
   * @returns true if the request is allowed, false otherwise.
   */
  tryAcquire(): boolean {
    const now = Date.now();
    this.cleanup(now);

    if (this.timestamps.length < this.limit) {
      this.timestamps.push(now);
      return true;
    }

    return false;
  }

  /**
   * Removes timestamps that are outside the current window.
   */
  private cleanup(now: number): void {
    const threshold = now - this.windowMs;
    while (this.timestamps.length > 0 && this.timestamps[0] <= threshold) {
      this.timestamps.shift();
    }
  }

  /**
   * Returns the number of remaining requests allowed in the current window.
   */
  getRemaining(): number {
    this.cleanup(Date.now());
    return Math.max(0, this.limit - this.timestamps.length);
  }

  /**
   * Returns the time in milliseconds until the next request will be allowed.
   * Returns 0 if a request is currently allowed.
   */
  getTimeUntilNextMs(): number {
    const now = Date.now();
    this.cleanup(now);

    if (this.timestamps.length < this.limit) {
      return 0;
    }

    const oldestTimestamp = this.timestamps[0];
    return Math.max(0, oldestTimestamp + this.windowMs - now);
  }
}

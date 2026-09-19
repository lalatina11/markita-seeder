/**
 * High-performance, resilient worker pool with retry, exponential backoff,
 * concurrency throttling, and pacing to prevent database connection exhaustion.
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute an async operation with exponential backoff and jitter.
 * Safe against transient database locks, network drops, and rate limits.
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 200;
  const maxDelayMs = options.maxDelayMs ?? 5000;

  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (err: unknown) {
      attempt++;
      if (attempt > maxRetries) {
        throw err;
      }

      const errorMessage = err instanceof Error ? err.message : String(err);

      // Don't retry unrecoverable client errors (400, 401, 403, 404, 422) unless it's a rate limit (429)
      const isClientError =
        (errorMessage.includes("(400)") ||
          errorMessage.includes("(401)") ||
          errorMessage.includes("(403)") ||
          errorMessage.includes("(404)") ||
          errorMessage.includes("(422)")) &&
        !errorMessage.includes("429");

      if (isClientError) {
        throw err;
      }

      // Calculate exponential backoff with full jitter
      const delay = Math.min(
        maxDelayMs,
        baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 100,
      );

      await sleep(delay);
    }
  }
}

export interface PoolProgress<TResult> {
  completed: number;
  total: number;
  successCount: number;
  failureCount: number;
  latestResult?: TResult;
  latestError?: Error;
}

export interface PoolOptions<TItem, TResult> {
  concurrency?: number;
  pacingDelayMs?: number;
  maxRetries?: number;
  abortSignal?: AbortSignal;
  onProgress?: (progress: PoolProgress<TResult>) => void;
}

export interface PoolResult<TResult> {
  results: TResult[];
  errors: Array<{ index: number; error: Error }>;
  successCount: number;
  failureCount: number;
}

/**
 * Executes tasks concurrently with a maximum limit on active parallel requests,
 * pacing delays, and safe error tolerance.
 */
export async function runConcurrentPool<TItem, TResult>(
  items: TItem[],
  worker: (item: TItem, index: number) => Promise<TResult>,
  options: PoolOptions<TItem, TResult> = {},
): Promise<PoolResult<TResult>> {
  const concurrency = Math.max(1, options.concurrency ?? 4);
  const pacingDelayMs = options.pacingDelayMs ?? 15;
  const maxRetries = options.maxRetries ?? 3;
  const total = items.length;

  if (total === 0) {
    return { results: [], errors: [], successCount: 0, failureCount: 0 };
  }

  const results: TResult[] = [];
  const errors: Array<{ index: number; error: Error }> = [];
  let nextIndex = 0;
  let completed = 0;
  let activeWorkers = 0;
  let consecutiveConnectionErrors = 0;

  return new Promise<PoolResult<TResult>>((resolve) => {
    let isAborted = false;

    if (options.abortSignal) {
      options.abortSignal.addEventListener("abort", () => {
        isAborted = true;
      });
    }

    const checkFinished = () => {
      if (completed >= total || (isAborted && activeWorkers === 0)) {
        resolve({
          results,
          errors,
          successCount: results.length,
          failureCount: errors.length,
        });
        return true;
      }
      return false;
    };

    const runWorker = async () => {
      while (nextIndex < total && !isAborted) {
        const currentIndex = nextIndex++;
        const item = items[currentIndex]!;
        activeWorkers++;

        let latestResult: TResult | undefined;
        let latestError: Error | undefined;

        try {
          latestResult = await executeWithRetry(
            () => worker(item, currentIndex),
            { maxRetries },
          );
          results.push(latestResult);
          consecutiveConnectionErrors = 0;
        } catch (err: unknown) {
          latestError = err instanceof Error ? err : new Error(String(err));
          errors.push({ index: currentIndex, error: latestError });

          if (
            latestError.message.includes("Unable to connect") ||
            latestError.message.includes("ECONNREFUSED") ||
            latestError.message.includes("Failed to connect")
          ) {
            consecutiveConnectionErrors++;
            if (consecutiveConnectionErrors >= 3) {
              isAborted = true; // Server is down, stop hammering dead port
            }
          }
        } finally {
          activeWorkers--;
          completed++;

          options.onProgress?.({
            completed,
            total,
            successCount: results.length,
            failureCount: errors.length,
            latestResult,
            latestError,
          });

          if (checkFinished()) {
            return;
          }
        }

        // Small pacing delay to avoid spiking database connections
        if (pacingDelayMs > 0 && !isAborted) {
          await sleep(pacingDelayMs);
        }
      }

      checkFinished();
    };

    // Spawn initial pool of workers
    const initialWorkers = Math.min(concurrency, total);
    for (let w = 0; w < initialWorkers; w++) {
      runWorker().catch(() => {});
    }
  });
}

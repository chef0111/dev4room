import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounce<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstCallRef = useRef<boolean>(true);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Execute immediately on first call
      if (isFirstCallRef.current) {
        isFirstCallRef.current = false;
        callback(...args);
        return;
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        isFirstCallRef.current = true;
      }, delay);
    }) as T,
    [callback, delay]
  );
}

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook to create a stable callback that doesn't change on re-renders
 * but always uses the latest version of the callback function.
 * 
 * This is useful to avoid adding callbacks to useEffect dependencies
 * while ensuring the latest callback logic is always executed.
 * 
 * @example
 * const handleClick = useStableCallback((id: string) => {
 *   // This function can use latest props/state
 *   console.log('Clicked:', id, someLatestProp);
 * });
 * 
 * useEffect(() => {
 *   // handleClick is stable, won't cause re-renders
 *   handleClick(someId);
 * }, [someId]); // No need to add handleClick to deps
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback);

  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Return a stable callback that calls the latest version
  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
};

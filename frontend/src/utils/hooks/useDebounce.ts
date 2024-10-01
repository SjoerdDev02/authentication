// import { useCallback, useRef } from 'react';

// const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
//   const timer = useRef<NodeJS.Timeout | null>(null);

//   const debouncedCallback = useCallback((...args: any[]) => {
//     if (timer.current) {
//       clearTimeout(timer.current);
//     }

//     timer.current = setTimeout(() => {
//       callback(...args);
//     }, delay);
//   }, [callback, delay]);

//   return debouncedCallback;
// };

// export default useDebounce;



// const App = () => {
//     const [value, setValue] = useState(0)
//     const throttled = useRef(throttle((newValue) => console.log(newValue), 1000))

//     useEffect(() => throttled.current(value), [value])

//     return (
//       <button onClick={() => setValue(value + 1)}>{value}</button>
//     )
//   }

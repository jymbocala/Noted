import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    // Checking if the value exists in local storage
    const jsonValue = localStorage.getItem(key);
    // If the value is not found, set it to the initial value provided
    if (jsonValue == null) {
      if (typeof initialValue === "function") {
        // If initialValue is a function, call it to get the initial value
        return (initialValue as () => T)();
      } else {
        // Otherwise, use the provided initial value directly
        return initialValue;
      }
    } else {
      // If the value exists, parse and return it
      return JSON.parse(jsonValue);
    }
  });

  // Update local storage wheneever value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  // Return the value and the setValue function as an array
  return [value, setValue] as [T, typeof setValue];
}

// Helper function to set deeply nested error values
export const setNestedError = (obj: any, path: (string | number | symbol)[], value: any) => {
  let current = obj;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const nextKey = path[i + 1];

    // Initialize current[key] if it doesn't exist
    if (!current[key]) {
      // If next key is a number, create an array, otherwise an object
      current[key] = typeof nextKey === "number" ? [] : {};
    }

    current = current[key];
  }

  // Set the final value
  const lastKey = path[path.length - 1];
  current[lastKey] = value;
};

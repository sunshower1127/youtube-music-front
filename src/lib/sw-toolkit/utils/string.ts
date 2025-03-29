/**
 * Converts a snake_case string to camelCase.
 * Example: "hello_world" -> "helloWorld"
 */
export function snakeToCamel(s: string): string {
  return s.replace(/(_\w)/g, (match) => match[1].toUpperCase());
}

/**
 * Converts a camelCase string to snake_case.
 * Example: "helloWorld" -> "hello_world"
 */
export function camelToSnake(s: string): string {
  return s.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
}

export function convertKeysToCamelCase(obj: Record<string, unknown>) {
  if (typeof obj !== "object" || obj === null) return obj;
  const newObj: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[snakeToCamel(key)] = obj[key];
    }
  }
  return newObj;
}

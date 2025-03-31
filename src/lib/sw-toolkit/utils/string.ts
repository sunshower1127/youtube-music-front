import { camelCase } from "es-toolkit";

export function convertKeysToCamelCase(obj: Record<string, unknown>) {
  if (typeof obj !== "object" || obj === null) return obj;
  const newObj: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[camelCase(key)] = obj[key];
    }
  }
  return newObj;
}

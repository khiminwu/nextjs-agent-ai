export function createCustomEvent<T>(name: string, detail: T): CustomEvent<T> {
  return new CustomEvent<T>(name, {
    detail,
    bubbles: true,
    cancelable: true,
  });
}
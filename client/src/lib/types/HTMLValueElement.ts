// HTML elements that have a "value" property.
export type HTMLValueElement = 
  | HTMLInputElement 
  | HTMLTextAreaElement 
  | HTMLSelectElement 
  | HTMLButtonElement;

export function isValueElement(element: EventTarget | Element | null): element is HTMLValueElement {
  if (!element) return false;
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLButtonElement
  );
}
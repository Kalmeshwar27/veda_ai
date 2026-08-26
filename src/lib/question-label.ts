export function parseQuestionLabel(label: string): {
  parent: string;
  sub: string | null;
} {
  const match = label.match(/^(\d+)\s*\(([a-zA-Z])\)$/);
  if (match) {
    return { parent: match[1], sub: match[2] };
  }
  return { parent: label, sub: null };
}
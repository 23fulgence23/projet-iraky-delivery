// Transforme **texte** en <strong>texte</strong>
export function rich(txt) {
  return String(txt).split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

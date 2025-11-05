export const TOKEN_RE = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;

export function renderWithContext(html: string, ctx: any): string {
  return html.replace(TOKEN_RE, (_m, path) => {
    const val = path.split('.').reduce((acc: any, k: string) => acc?.[k], ctx);
    return val !== undefined && val !== null ? String(val) : `[[${path}]]`;
  });
}

export function getPlaceholders(html: string): string[] {
  const set = new Set<string>();
  let m;
  const regex = new RegExp(TOKEN_RE.source, TOKEN_RE.flags);
  while ((m = regex.exec(html))) {
    set.add(m[1]);
  }
  return [...set];
}

export function hasEmptyPlaceholders(html: string): boolean {
  return /\[\[[a-zA-Z0-9_.]+\]\]/.test(html);
}

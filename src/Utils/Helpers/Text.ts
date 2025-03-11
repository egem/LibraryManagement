export function trimAllExtraSpaces(
  input?: string
): string {
  if (!input?.length) {
    return '';
  }

  return input.trim().replace(/\s/g, ' ').replace(/\s{2,}/g, ' ');
}

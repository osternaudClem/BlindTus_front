const TITLE_PREFIX = 'BlindTus • ';
export function updateTitle(title) {
  document.title = `${TITLE_PREFIX}${title}`;
}
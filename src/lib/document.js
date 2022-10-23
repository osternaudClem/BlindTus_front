const TITLE_PREFIX = 'BlindTus • ';

/**
 * @name updateTitle
 * @param {string} title
 */
export function updateTitle(title) {
  document.title = `${TITLE_PREFIX}${title}`;
}

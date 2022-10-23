/**
 * @name isToday
 * @param {string} dateString
 * @returns {boolean}
 */
export function isToday(dateString) {
  const today = new Date();
  const date = new Date(dateString);

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

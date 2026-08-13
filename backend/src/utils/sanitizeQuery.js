/**
 * Escape special characters in user input for safe RegExp matching
 */
function escapeRegex(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Validate and Sanitize Sort Parameters against Whitelisted Allowed Fields
 */
function sanitizeSort(sortBy, sortOrder, allowedFields = [], defaultField = 'createdAt') {
  const isAsc = String(sortOrder).toLowerCase() === 'asc' || sortOrder === 1 || sortOrder === '1';
  const order = isAsc ? 1 : -1;

  let field = defaultField;
  if (sortBy && allowedFields.includes(sortBy)) {
    field = sortBy;
  }

  return { [field]: order, field, order, isAsc };
}

module.exports = {
  escapeRegex,
  sanitizeSort,
};

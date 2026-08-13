/**
 * Build Standardized Pagination Metadata Object
 */
function buildPaginationMeta(page = 1, limit = 10, total = 0) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const totalPages = Math.ceil(total / l) || 1;

  return {
    page: p,
    limit: l,
    total,
    totalPages,
    hasNext: p < totalPages,
    hasPrevious: p > 1,
  };
}

module.exports = {
  buildPaginationMeta,
};

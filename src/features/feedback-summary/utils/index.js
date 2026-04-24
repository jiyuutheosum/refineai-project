// Feature-specific utilities
export const calculateProgress = (checkedCount, totalCount) => {
  return totalCount > 0 ? (checkedCount / totalCount) * 100 : 0
}


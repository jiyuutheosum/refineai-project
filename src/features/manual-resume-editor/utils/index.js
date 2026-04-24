export const getAutoSaveText = (status, lastSaved) => {
  if (status === 'saving') return 'Saving...'
  return 'Saved'
}


export const validateFile = (file) => {
  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const minSize = 2 * 1024 * 1024;
  const maxSize = 5 * 1024 * 1024;

  if (!validTypes.includes(file?.type)) {
    return {
      valid: false,
      type: 'error',
      message: 'Invalid file format. Please upload a PDF or DOCX file only.'
    };
  }

  if (file?.size < minSize) {
    return {
      valid: false,
      type: 'error',
      message: `File size is too small (${(file?.size / 1024 / 1024)?.toFixed(2)} MB). Minimum required size is 2 MB.`
    };
  }

  if (file?.size > maxSize) {
    return {
      valid: false,
      type: 'error',
      message: `File size exceeds the limit (${(file?.size / 1024 / 1024)?.toFixed(2)} MB). Maximum allowed size is 5 MB.`
    };
  }

  return {
    valid: true,
    type: 'success',
    message: `File validated successfully! ${file?.name} (${(file?.size / 1024 / 1024)?.toFixed(2)} MB) is ready for processing.`
  };
};

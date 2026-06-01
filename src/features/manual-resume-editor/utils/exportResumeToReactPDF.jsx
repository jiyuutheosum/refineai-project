/**
 * exportResumeToReactPDF.js
 *
 * Parallel high-quality PDF export using @react-pdf/renderer (vector-based).
 *
 * This gives dramatically sharper text than the html2canvas path.
 * Currently exposed via the "Vector PDF (Beta)" buttons.
 *
 * Recent improvements:
 * - Stronger HTML parser (proper <ul>/<ol>, bold, italic, underline)
 * - Proper Inter font embedding for professional typography
 * - Polished Modern two-column layout
 */

import { pdf } from '@react-pdf/renderer';
import { ResumeReactPDFDocument } from '../components/ResumeReactPDFDocument';

/**
 * Exports the resume using @react-pdf/renderer (vector PDF).
 *
 * @param {Object} params
 * @param {Object} params.resume - The edited sections (same shape as before)
 * @param {string} params.templateId - 'classic' | 'traditional' | 'modern'
 * @param {string} [params.originalFileName]
 * @returns {Promise<void>} - Triggers download
 */
export async function exportResumeToReactPDF({
  resume,
  templateId = 'classic',
  originalFileName = '',
}) {
  try {
    // Generate the PDF blob using the React component
    const blob = await pdf(
      <ResumeReactPDFDocument
        resume={resume}
        templateId={templateId}
      />
    ).toBlob();

    // Create a smart filename
    const filename = generateReactPDFFilename(resume, originalFileName, templateId);

    // Trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    // Consider sending to error monitoring (Sentry, etc.) in production
    throw new Error(
      error?.message || 'Failed to generate high-quality PDF. Please try again.'
    );
  }
}

function generateReactPDFFilename(resume, originalFileName, templateId) {
  let name = '';
  const personal = resume?.personalInfo || '';
  const text = personal.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const firstLine = text.split(/[\n•|–—-]/)[0]?.trim() || '';

  if (firstLine.length > 2 && firstLine.length < 60) {
    const parts = firstLine.split(/\s+/).filter(Boolean);
    name = parts.length >= 2 ? `${parts[0]}_${parts[1]}` : parts[0];
  }

  if (!name && originalFileName) {
    name = originalFileName.replace(/\.[^/.]+$/, '').replace(/[^\w\-]/g, '_');
  }

  if (!name) name = 'Resume';

  const suffix = templateId ? `_${templateId}` : '';
  return `${name}_Resume${suffix}.pdf`;
}

// Future: We can expose a version that returns the blob instead of downloading
export { generateReactPDFFilename };

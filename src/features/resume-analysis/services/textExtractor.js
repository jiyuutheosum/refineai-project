import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

/**
 * Extract text directly from a File object — no network fetch needed
 */
export async function extractTextFromFile(file) {
  const arrayBuffer = await file.arrayBuffer()

  if (file.type === 'application/pdf') {
    return extractFromPDF(arrayBuffer)
  } else {
    return extractFromDOCX(arrayBuffer)
  }
}

async function extractFromPDF(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => item.str).join(' ')
    fullText += pageText + '\n'
  }

  return fullText.trim()
}

async function extractFromDOCX(arrayBuffer) {
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.trim()
}
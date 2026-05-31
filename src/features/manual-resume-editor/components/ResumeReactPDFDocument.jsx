/**
 * ResumeReactPDFDocument.jsx
 *
 * Parallel, high-quality PDF renderer using @react-pdf/renderer.
 *
 * This is a SCAFFOLD for a vector-based PDF export solution.
 * Benefits over html2canvas:
 *   - True vector text (perfectly sharp at any zoom or print size)
 *   - Better typography control
 *   - No rasterization artifacts
 *
 * Current limitations (scaffolding phase):
 *   - Basic HTML parsing for content (bold, italic, simple lists)
 *   - Not yet 100% pixel-perfect with the old screen previews
 *   - Only the three core templates are supported
 *
 * Usage:
 *   import { exportResumeToReactPDF } from '../utils/exportResumeToReactPDF';
 *
 * Data shape expected (same as before):
 *   resume = {
 *     personalInfo: "<p>...</p>",
 *     summary: "...",
 *     experience: "...",
 *     education: "...",
 *     skills: "...",
 *     seminarsAndCertificates: "..."
 *   }
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register professional fonts for sharp vector output
// Using Inter (popular, clean, excellent for resumes)
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZg.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZg.ttf',
      fontWeight: 700,
    },
    // Italic variants are commented out for now because we don't have
    // reliable public TTF URLs that @react-pdf/renderer can resolve in all cases.
    // Once good italic font files are available, we can re-enable them.
    // {
    //   src: '...italic-400.ttf',
    //   fontWeight: 400,
    //   fontStyle: 'italic',
    // },
  ],
});

// Stronger HTML → React-PDF parser
// Supports: <p>, <br>, <strong>/<b>, <em>/<i>, <u>, <ul>/<li>, <ol>/<li>
// Also gracefully strips <a> and <span> tags (common from Tiptap) while preserving text.
function parseHtmlToElements(html = '', baseStyle = null) {
  if (!html || !html.trim()) return [];

  const elements = [];
  let key = 0;

  // Normalize: convert <br> and </p><p> into line breaks
  let normalized = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<\/?p[^>]*>/gi, '\n')
    // Strip <a> tags (and other unsupported inline tags) but keep their visible text.
    // This fixes cases where Tiptap auto-links things like "draw.io" and leaks raw <a> HTML into the PDF.
    .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1')
    .trim();

  // Handle unordered lists
  normalized = normalized.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    return items
      .map((item) => {
        // Also strip any remaining links inside list items
        const clean = item
          .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
          .replace(/<\/?li[^>]*>/gi, '')
          .trim();
        return '• ' + clean;
      })
      .join('\n') + '\n';
  });

  // Handle ordered lists
  normalized = normalized.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    return items
      .map((item, idx) => {
        const clean = item
          .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
          .replace(/<\/?li[^>]*>/gi, '')
          .trim();
        return `${idx + 1}. ` + clean;
      })
      .join('\n') + '\n';
  });

  // Final safety pass: strip any remaining unsupported tags (in case of nested or unusual HTML from Tiptap)
  normalized = normalized
    .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');

  const lines = normalized.split(/\n+/).filter((line) => line.trim());

  const parseInline = (text) => {
    // Process formatting from inside out
    let result = text;

    // Bold
    result = result.replace(/<(?:strong|b)[^>]*>(.*?)<\/(?:strong|b)>/gi, (_, t) => `**${t}**`);
    // Italic
    result = result.replace(/<(?:em|i)[^>]*>(.*?)<\/(?:em|i)>/gi, (_, t) => `_${t}_`);
    // Underline
    result = result.replace(/<u[^>]*>(.*?)<\/u>/gi, (_, t) => `__${t}__`);

    // Split on formatting markers
    const parts = result.split(/(\*\*.*?\*\*|__.*?__|_.*?_)/g).filter(Boolean);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <Text key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</Text>;
      }
      if (part.startsWith('__') && part.endsWith('__')) {
        return <Text key={i} style={{ textDecoration: 'underline' }}>{part.slice(2, -2)}</Text>;
      }
      if (part.startsWith('_') && part.endsWith('_')) {
        // We avoid requesting fontStyle: 'italic' because we have not
        // registered italic variants of Inter yet. Using regular weight
        // prevents the error: "Could not resolve font for Inter, fontWeight 400, fontStyle italic"
        return <Text key={i} style={{ fontWeight: 400 }}>{part.slice(1, -1)}</Text>;
      }
      return part;
    });
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const isBullet = trimmed.startsWith('• ');
    const isNumbered = /^\d+\.\s/.test(trimmed);

    const textStyle = baseStyle 
      ? { ...styles.body, ...baseStyle } 
      : styles.body;

    if (isBullet || isNumbered) {
      elements.push(
        <Text key={key++} style={baseStyle ? textStyle : styles.bullet}>
          {parseInline(trimmed)}
        </Text>
      );
    } else {
      elements.push(
        <Text key={key++} style={textStyle}>
          {parseInline(trimmed)}
        </Text>
      );
    }
  });

  return elements;
}

// Shared styles - using Inter for crisp professional look
const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Inter',
    fontSize: 10.5,
    lineHeight: 1.5,
    color: '#1f2937',
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginTop: 16,
    marginBottom: 7,
    borderBottomWidth: 0.6,
    borderBottomColor: '#64748b',
    paddingBottom: 4,
    color: '#1f2937',
  },
  body: {
    fontSize: 10.5,
    marginBottom: 5,
    lineHeight: 1.55,
  },
  bullet: {
    fontSize: 10.5,
    marginBottom: 4,
    marginLeft: 14,
    lineHeight: 1.5,
  },
  name: {
    fontSize: 13,          // Only slightly larger than body text (10.5pt)
    fontWeight: 700,
    marginBottom: 2,
    lineHeight: 1.25,
  },
  // Modern template specific
  modernSidebar: {
    width: '37%',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: 20,
    paddingTop: 22,
  },
  modernMain: {
    width: '63%',
    padding: 20,
    paddingTop: 22,
  },
  modernSidebarHeader: {
    fontSize: 9,
    fontWeight: 600,
    color: '#94a3b8',
    marginTop: 14,
    marginBottom: 5,
    letterSpacing: 0.8,
  },
  modernMainHeader: {
    fontSize: 9,
    fontWeight: 600,
    color: '#64748b',
    marginTop: 12,
    marginBottom: 5,
    letterSpacing: 0.8,
  },
});

// Helper to render Personal Information section nicely:
// - First line (usually the name) is slightly bigger/bolder
// - Remaining lines (phone, email, location, etc.) stay normal size
function renderPersonalInfo(html, extraNameStyle = {}) {
  if (!html) return null;

  const elements = parseHtmlToElements(html);
  if (elements.length === 0) return null;

  const nameStyle = { ...styles.name, ...extraNameStyle };

  return (
    <>
      {/* Name - first block, slightly larger */}
      <Text style={nameStyle}>
        {elements[0].props.children}
      </Text>

      {/* Rest of personal info (contact details) - normal size */}
      {elements.slice(1).map((el, index) =>
        React.cloneElement(el, {
          key: `rest-${index}`,
          style: styles.body,
        })
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE: CLASSIC
// ─────────────────────────────────────────────────────────────────────────────
function ClassicTemplate({ resume }) {
  return (
    <Page size="A4" style={styles.page}>
      {resume.personalInfo && (
        <View style={{ marginBottom: 10, textAlign: 'center' }}>
          {renderPersonalInfo(resume.personalInfo)}
        </View>
      )}

      {resume.summary && (
        <>
          <Text style={styles.sectionHeader}>Professional Summary</Text>
          {parseHtmlToElements(resume.summary)}
        </>
      )}

      {resume.experience && (
        <>
          <Text style={styles.sectionHeader}>Work Experience</Text>
          {parseHtmlToElements(resume.experience)}
        </>
      )}

      {resume.education && (
        <>
          <Text style={styles.sectionHeader}>Education</Text>
          {parseHtmlToElements(resume.education)}
        </>
      )}

      {resume.skills && (
        <>
          <Text style={styles.sectionHeader}>Skills</Text>
          {parseHtmlToElements(resume.skills)}
        </>
      )}

      {resume.seminarsAndCertificates && (
        <>
          <Text style={styles.sectionHeader}>Seminars & Certificates</Text>
          {parseHtmlToElements(resume.seminarsAndCertificates)}
        </>
      )}
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE: TRADITIONAL
// ─────────────────────────────────────────────────────────────────────────────
function TraditionalTemplate({ resume }) {
  return (
    <Page size="A4" style={styles.page}>
      {resume.personalInfo && (
        <View style={{ marginBottom: 12, borderBottomWidth: 2, borderBottomColor: '#1e40af', paddingBottom: 8 }}>
          {renderPersonalInfo(resume.personalInfo)}
        </View>
      )}

      {resume.summary && (
        <>
          <Text style={[styles.sectionHeader, { color: '#1e40af' }]}>Objective / Summary</Text>
          {parseHtmlToElements(resume.summary)}
        </>
      )}

      {resume.experience && (
        <>
          <Text style={[styles.sectionHeader, { color: '#1e40af' }]}>Professional Experience</Text>
          {parseHtmlToElements(resume.experience)}
        </>
      )}

      {resume.education && (
        <>
          <Text style={[styles.sectionHeader, { color: '#1e40af' }]}>Education</Text>
          {parseHtmlToElements(resume.education)}
        </>
      )}

      {resume.skills && (
        <>
          <Text style={[styles.sectionHeader, { color: '#1e40af' }]}>Skills</Text>
          {parseHtmlToElements(resume.skills)}
        </>
      )}

      {resume.seminarsAndCertificates && (
        <>
          <Text style={[styles.sectionHeader, { color: '#1e40af' }]}>Certifications & Seminars</Text>
          {parseHtmlToElements(resume.seminarsAndCertificates)}
        </>
      )}
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE: MODERN (Two-column sidebar) - Polished version
// ─────────────────────────────────────────────────────────────────────────────
function ModernTemplate({ resume }) {
  return (
    <Page size="A4" style={{ flexDirection: 'row', fontFamily: 'Inter' }}>
      {/* Left Sidebar */}
      <View style={styles.modernSidebar}>
        {resume.personalInfo && (
          <View style={{ marginBottom: 8 }}>
            {renderPersonalInfo(resume.personalInfo, { color: '#fff' })}
          </View>
        )}

        {resume.skills && (
          <>
            <Text style={styles.modernSidebarHeader}>SKILLS</Text>
            {parseHtmlToElements(resume.skills)}
          </>
        )}

        {resume.seminarsAndCertificates && (
          <>
            <Text style={styles.modernSidebarHeader}>CERTIFICATIONS</Text>
            {parseHtmlToElements(resume.seminarsAndCertificates)}
          </>
        )}
      </View>

      {/* Right Main Content */}
      <View style={styles.modernMain}>
        {resume.summary && (
          <>
            <Text style={styles.modernMainHeader}>PROFILE</Text>
            {parseHtmlToElements(resume.summary)}
          </>
        )}

        {resume.experience && (
          <>
            <Text style={styles.modernMainHeader}>EXPERIENCE</Text>
            {parseHtmlToElements(resume.experience)}
          </>
        )}

        {resume.education && (
          <>
            <Text style={styles.modernMainHeader}>EDUCATION</Text>
            {parseHtmlToElements(resume.education)}
          </>
        )}
      </View>
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Document Component
// ─────────────────────────────────────────────────────────────────────────────
export function ResumeReactPDFDocument({ resume, templateId = 'classic' }) {
  const safeResume = {
    personalInfo: resume?.personalInfo || '',
    summary: resume?.summary || '',
    experience: resume?.experience || '',
    education: resume?.education || '',
    skills: resume?.skills || '',
    seminarsAndCertificates: resume?.seminarsAndCertificates || '',
  };

  if (templateId === 'traditional') {
    return (
      <Document>
        <TraditionalTemplate resume={safeResume} />
      </Document>
    );
  }

  if (templateId === 'modern') {
    return (
      <Document>
        <ModernTemplate resume={safeResume} />
      </Document>
    );
  }

  // Default: Classic
  return (
    <Document>
      <ClassicTemplate resume={safeResume} />
    </Document>
  );
}

export default ResumeReactPDFDocument;

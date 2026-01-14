import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import EditorToolbar from './EditorToolbar';

const SectionEditor = ({ 
  section, 
  content, 
  onContentChange, 
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  validationIssues = []
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localContent, setLocalContent] = useState(content);
  const editorRef = useRef(null);
  const [history, setHistory] = useState([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleContentChange = (e) => {
    const newContent = e?.target?.value;
    setLocalContent(newContent);
    
    const newHistory = history?.slice(0, historyIndex + 1);
    newHistory?.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory?.length - 1);
    
    onContentChange(newContent);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousContent = history?.[newIndex];
      setLocalContent(previousContent);
      onContentChange(previousContent);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history?.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextContent = history?.[newIndex];
      setLocalContent(nextContent);
      onContentChange(nextContent);
    }
  };

  const applyFormat = (format) => {
    const textarea = editorRef?.current;
    if (!textarea) return;

    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;
    const selectedText = localContent?.substring(start, end);

    if (!selectedText) return;

    let formattedText = selectedText;
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      default:
        break;
    }

    const newContent = localContent?.substring(0, start) + formattedText + localContent?.substring(end);
    setLocalContent(newContent);
    onContentChange(newContent);
  };

  const getSectionIcon = () => {
    const icons = {
      'Education': 'GraduationCap',
      'Skills': 'Wrench',
      'Experience': 'Briefcase',
      'Projects': 'FolderKanban',
      'Certifications': 'Award'
    };
    return icons?.[section] || 'FileText';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden transition-smooth">
      <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded transition-smooth"
          >
            <Icon name={isExpanded ? 'ChevronDown' : 'ChevronRight'} size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              <Icon name={getSectionIcon()} size={16} className="text-primary" />
            </div>
            <h3 className="text-base font-heading font-semibold text-foreground">{section}</h3>
          </div>
          {validationIssues?.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-warning/10 rounded-md">
              <Icon name="AlertCircle" size={14} className="text-warning" />
              <span className="text-xs font-medium text-warning">{validationIssues?.length}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronUp"
            onClick={onMoveUp}
            disabled={isFirst}
            className="w-8 h-8 p-0"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronDown"
            onClick={onMoveDown}
            disabled={isLast}
            className="w-8 h-8 p-0"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={onDelete}
            className="w-8 h-8 p-0 text-error hover:bg-error/10"
          />
        </div>
      </div>
      {isExpanded && (
        <div>
          <EditorToolbar
            onBold={() => applyFormat('bold')}
            onItalic={() => applyFormat('italic')}
            onUnderline={() => applyFormat('underline')}
            onBulletList={() => {}}
            onNumberedList={() => {}}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history?.length - 1}
          />

          <div className="p-4">
            <textarea
              ref={editorRef}
              value={localContent}
              onChange={handleContentChange}
              className="w-full min-h-[200px] p-3 bg-background border border-border rounded-lg text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              placeholder={`Enter your ${section?.toLowerCase()} details here...`}
            />

            {validationIssues?.length > 0 && (
              <div className="mt-3 space-y-2">
                {validationIssues?.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-warning/5 border border-warning/20 rounded-lg">
                    <Icon name="AlertCircle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{issue}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionEditor;
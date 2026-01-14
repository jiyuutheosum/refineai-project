import React from 'react';

import Button from '../../../components/ui/Button';

const EditorToolbar = ({ 
  onBold, 
  onItalic, 
  onUnderline, 
  onBulletList, 
  onNumberedList,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  activeFormats = {}
}) => {
  const formatButtons = [
    { icon: 'Bold', action: onBold, active: activeFormats?.bold, label: 'Bold' },
    { icon: 'Italic', action: onItalic, active: activeFormats?.italic, label: 'Italic' },
    { icon: 'Underline', action: onUnderline, active: activeFormats?.underline, label: 'Underline' }
  ];

  const listButtons = [
    { icon: 'List', action: onBulletList, active: activeFormats?.bulletList, label: 'Bullet List' },
    { icon: 'ListOrdered', action: onNumberedList, active: activeFormats?.numberedList, label: 'Numbered List' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/50 border-b border-border">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          iconName="Undo"
          onClick={onUndo}
          disabled={!canUndo}
          className="w-8 h-8 p-0"
        />
        <Button
          variant="ghost"
          size="sm"
          iconName="Redo"
          onClick={onRedo}
          disabled={!canRedo}
          className="w-8 h-8 p-0"
        />
      </div>
      <div className="w-px h-6 bg-border" />
      <div className="flex items-center gap-1">
        {formatButtons?.map((btn) => (
          <Button
            key={btn?.icon}
            variant={btn?.active ? "default" : "ghost"}
            size="sm"
            iconName={btn?.icon}
            onClick={btn?.action}
            className="w-8 h-8 p-0"
            aria-label={btn?.label}
          />
        ))}
      </div>
      <div className="w-px h-6 bg-border" />
      <div className="flex items-center gap-1">
        {listButtons?.map((btn) => (
          <Button
            key={btn?.icon}
            variant={btn?.active ? "default" : "ghost"}
            size="sm"
            iconName={btn?.icon}
            onClick={btn?.action}
            className="w-8 h-8 p-0"
            aria-label={btn?.label}
          />
        ))}
      </div>
    </div>
  );
};

export default EditorToolbar;
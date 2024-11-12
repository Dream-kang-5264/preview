import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Save, X, Edit2, Plus, Trash2 } from 'lucide-react';
import { ParsedDocument, DocumentSection, DocumentStyle } from './types/document';
import { Button } from 'antd';

interface DocumentStructureEditorProps {
  document: ParsedDocument;
  onSave: (document: ParsedDocument) => void;
  onCancel: () => void;
}

const DocumentStructureEditor: React.FC<DocumentStructureEditorProps> = ({
  document,
  onSave,
  onCancel,
}) => {
  const [editedDocument, setEditedDocument] = useState<ParsedDocument>(document);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const handleSectionUpdate = (sectionId: string, updates: Partial<DocumentSection>) => {
    setEditedDocument(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  };

  const handleStyleUpdate = (sectionId: string, styleUpdates: Partial<DocumentStyle>) => {
    setEditedDocument(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, style: { ...section.style, ...styleUpdates } }
          : section
      ),
    }));
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = editedDocument.sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && sectionIndex === 0) ||
      (direction === 'down' && sectionIndex === editedDocument.sections.length - 1)
    ) {
      return;
    }

    const newSections = [...editedDocument.sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    [newSections[sectionIndex], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[sectionIndex],
    ];

    setEditedDocument(prev => ({
      ...prev,
      sections: newSections,
    }));
  };

  const handleAddSection = (index: number) => {
    const newSection: DocumentSection = {
      id: `new-${Date.now()}`,
      type: 'paragraph',
      content: '',
      style: editedDocument.styles.normal,
      spacing: {
        before: 0,
        after: 0,
        lineSpacing: 1.5,
        lineSpacingRule: 'multiple',
        textAlign: 'left'
      },
      indentation: {
        left: 0,
        right: 0,
        firstLine: 0,
        hanging: 0,
      },
      isPageBreakBefore: false,
      isKeepWithNext: false,
      isKeepTogether: false,
      textAlign: 'left'
    };

    const newSections = [...editedDocument.sections];
    newSections.splice(index + 1, 0, newSection);
    setEditedDocument(prev => ({
      ...prev,
      sections: newSections,
    }));


    setEditingSectionId(newSection.id);
  };

  const handleDeleteSection = (sectionId: string) => {
    setEditedDocument(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
    }));
  };

  const renderSectionEditor = (section: DocumentSection, index: number) => {
    const isEditing = editingSectionId === section.id;


    return (
      <div key={section.id} className="border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              type='button'
              onClick={() => handleMoveSection(section.id, 'up')}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={index === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type='button'
              onClick={() => handleMoveSection(section.id, 'down')}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={index === editedDocument.sections.length - 1}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            <span className="font-medium">段落 {index + 1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type='button'
              onClick={() => {
                setEditingSectionId(isEditing ? null : section.id)
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {!isEditing ? <Edit2 className="h-4 w-4" /> : <Button size='small' type='primary'>完成</Button>}

            </button>
            <button
              type='button'
              onClick={() => handleDeleteSection(section.id)}
              className="p-1 hover:bg-gray-100 rounded text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容
              </label>
              <textarea
                value={section.content}
                onChange={e => handleSectionUpdate(section.id, { content: e.target.value })}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  字体
                </label>
                <select
                  value={section.style.fontFamily}
                  onChange={e => handleStyleUpdate(section.id, { fontFamily: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="SimSun">宋体</option>
                  <option value="SimHei">黑体</option>
                  <option value="KaiTi">楷体</option>
                  <option value="FangSong">仿宋</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  字号
                </label>
                <input
                  type="number"
                  value={section.style.fontSize}
                  onChange={e => handleStyleUpdate(section.id, { fontSize: Number(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  行距
                </label>
                <input
                  type="number"
                  value={section.spacing.lineSpacing}
                  onChange={e => handleSectionUpdate(section.id, {
                    spacing: { ...section.spacing, lineSpacing: Number(e.target.value) }
                  })}
                  step={0.1}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  首行缩进
                </label>
                <input
                  type="number"
                  value={section.indentation.firstLine}
                  onChange={e => handleSectionUpdate(section.id, {
                    indentation: { ...section.indentation, firstLine: Number(e.target.value) }
                  })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="p-4 bg-gray-50 rounded-md"
            style={{
              fontFamily: section.style.fontFamily,
              fontSize: `${section.style.fontSize}px`,
              lineHeight: section.spacing.lineSpacing,
              textIndent: `${section.indentation.firstLine}em`,
              // color: section.style.color ? `rgb(${section.style.color[0]}, ${section.style.color[1]}, ${section.style.color[2]})`:'',
              textAlign: section.spacing.textAlign,
              fontWeight: section.style.fontWeight,

            }}
          >
            {section.content || <span className="text-gray-400">空白段落</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">文档结构编辑</h2>
        <div className="flex items-center space-x-2">
          <button
            type='button'
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button
            type='button'
            onClick={() => onSave(editedDocument)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            保存模板
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {editedDocument.sections.map((section, index) => (
          <React.Fragment key={section.id}>
            {renderSectionEditor(section, index)}
            <button
              type='button'
              onClick={() => handleAddSection(index)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              在此处添加段落
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DocumentStructureEditor;
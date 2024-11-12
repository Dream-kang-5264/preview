import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader } from 'lucide-react';
import { ParsedDocument } from './types/document';
import { uploadDocument, saveTemplate } from './api/document';
import DocumentStructureEditor from './DocumentStructureEditor';
import { uploadTemplate } from '@/api/Templet';

interface TemplateUploaderProps {
  onUploadComplete: (template: ParsedDocument) => void;
}

const TemplateUploader: React.FC<TemplateUploaderProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedDocument, setParsedDocument] = useState<ParsedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    let token: any = localStorage.getItem('token')
    formData.append('token', token);
    formData.append('file', file);
    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await uploadTemplate(formData)

      if (response.data.status.code === 200) {
        clearInterval(progressInterval);
        setUploadProgress(100);
        console.log(JSON.parse(response.data.parsing_format));
        setParsedDocument(JSON.parse(response.data.parsing_format));
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '文件上传或解析失败，请重试');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false
  });

  const handleSave = async (updatedDocument: ParsedDocument) => {
    console.log(updatedDocument);

    try {
      const response = await saveTemplate({
        documentId: updatedDocument.metadata.title,
        parsedDocument: updatedDocument,
        templateName: updatedDocument.metadata.title,
        templateCategory: updatedDocument.metadata.category || '未分类',
        isPublic: false,
      });

      if (response.status === 'success') {
        onUploadComplete(updatedDocument);
      } else {
        setError(response.error || '保存模板失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存模板失败');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {!parsedDocument ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">拖放Word文档到此处，或点击选择文件</p>
          <p className="text-sm text-gray-500 mt-2">支持 .doc, .docx 格式</p>
        </div>
      ) : (
        <DocumentStructureEditor
          document={parsedDocument}
          onSave={handleSave}
          onCancel={() => setParsedDocument(null)}
        />
      )}

      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <p className="text-center text-gray-700 mb-4">正在解析文档结构...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">{uploadProgress}%</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TemplateUploader;
import { ParsedDocument } from '../types/document';
import a from './mock.json'
interface UploadResponse {
  documentId: string;
  parseStatus: 'success' | 'error';
  parsedDocument?: any;
  error?: string;
}

interface SaveTemplateRequest {
  documentId: string;
  parsedDocument: ParsedDocument;
  templateName: string;
  templateCategory: string;
  isPublic: boolean;
}

interface SaveTemplateResponse {
  templateId: string;
  status: 'success' | 'error';
  error?: string;
}

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  // 模拟文件上传和解析过程
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 模拟解析结果
  const mockParsedDocument: ParsedDocument = {
    metadata: {
      title: file.name.replace(/\.[^/.]+$/, ''),
      author: '张三',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      revision: 1,
    },
    settings: {
      margins: {
        top: 2.54,
        bottom: 2.54,
        left: 3.17,
        right: 3.17,
        header: 1.5,
        footer: 1.5,
      },
      paperSize: {
        width: 21,
        height: 29.7,
        orientation: 'portrait',
      },
      defaultFontFamily: 'SimSun',
      defaultFontSize: 14,
      defaultLineSpacing: 1.5,
    },
    sections: [
      {
        id: '1',
        type: 'heading',
        level: 1,
        content: '关于XX的通知',
        style: {
          fontFamily: 'SimSun',
          fontSize: 30,
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#000000',
          lineHeight: 1.5,
          textAlign: 'center',
          isUnderline: false,
          isStrikethrough: false,
        },
        spacing: {
          before: 0,
          after: 0,
          lineSpacing: 1.5,
          lineSpacingRule: 'multiple',
        },
        indentation: {
          left: 0,
          right: 0,
          firstLine: 0,
          hanging: 0,
        },
        isPageBreakBefore: false,
        isKeepWithNext: true,
        isKeepTogether: true,
      },
      {
        id: '2',
        type: 'paragraph',
        content: '各部门：',
        style: {
          fontFamily: 'FangSong',
          fontSize: 22,
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#000000',
          lineHeight: 1.5,
          textAlign: 'left',
          isUnderline: false,
          isStrikethrough: false,
        },
        spacing: {
          before: 20,
          after: 20,
          lineSpacing: 1.5,
          lineSpacingRule: 'multiple',
        },
        indentation: {
          left: 0,
          right: 0,
          firstLine: 2,
          hanging: 0,
        },
        isPageBreakBefore: false,
        isKeepWithNext: false,
        isKeepTogether: true,
      },
      {
        id: '3',
        type: 'heading',
        level: 2,
        content: '一、主要事项',
        style: {
          fontFamily: 'SimHei',
          fontSize: 22,
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#000000',
          lineHeight: 1.5,
          textAlign: 'left',
          isUnderline: false,
          isStrikethrough: false,
        },
        spacing: {
          before: 20,
          after: 20,
          lineSpacing: 1.5,
          lineSpacingRule: 'multiple',
        },
        indentation: {
          left: 0,
          right: 0,
          firstLine: 2,
          hanging: 0,
        },
        isPageBreakBefore: false,
        isKeepWithNext: true,
        isKeepTogether: true,
      },
      {
        id: '4',
        type: 'paragraph',
        content: '现就有关事项通知如下：',
        style: {
          fontFamily: 'FangSong',
          fontSize: 22,
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#000000',
          lineHeight: 1.5,
          textAlign: 'left',
          isUnderline: false,
          isStrikethrough: false,
        },
        spacing: {
          before: 20,
          after: 20,
          lineSpacing: 1.5,
          lineSpacingRule: 'multiple',
        },
        indentation: {
          left: 0,
          right: 0,
          firstLine: 2,
          hanging: 0,
        },
        isPageBreakBefore: false,
        isKeepWithNext: false,
        isKeepTogether: true,
      },
      {
        id: '5',
        type: 'heading',
        level: 3,
        content: '（一）工作要求',
        style: {
          fontFamily: 'KaiTi',
          fontSize: 22,
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#000000',
          lineHeight: 1.5,
          textAlign: 'left',
          isUnderline: false,
          isStrikethrough: false,
        },
        spacing: {
          before: 20,
          after: 20,
          lineSpacing: 1.5,
          lineSpacingRule: 'multiple',
        },
        indentation: {
          left: 0,
          right: 0,
          firstLine: 2,
          hanging: 0,
        },
        isPageBreakBefore: false,
        isKeepWithNext: true,
        isKeepTogether: true,
      },
      {
        id: '6',
        type: 'paragraph',
        content: '各部门要高度重视，认真组织实施。',
        style: {
          fontFamily: 'FangSong',
          fontSize: 22,
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#000000',
          lineHeight: 1.5,
          textAlign: 'left',
          isUnderline: false,
          isStrikethrough: false,
        },
        spacing: {
          before: 20,
          after: 20,
          lineSpacing: 1.5,
          lineSpacingRule: 'multiple',
        },
        indentation: {
          left: 0,
          right: 0,
          firstLine: 2,
          hanging: 0,
        },
        isPageBreakBefore: false,
        isKeepWithNext: false,
        isKeepTogether: true,
      },
    ],
    styles: {
      heading1: {
        fontFamily: 'SimHei',
        fontSize: 22,
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        lineHeight: 1.5,
        textAlign: 'left',
        isUnderline: false,
        isStrikethrough: false,
      },
      heading2: {
        fontFamily: 'KaiTi',
        fontSize: 22,
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        lineHeight: 1.5,
        textAlign: 'left',
        isUnderline: false,
        isStrikethrough: false,
      },
      heading3: {
        fontFamily: 'FangSong',
        fontSize: 22,
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        lineHeight: 1.5,
        textAlign: 'left',
        isUnderline: false,
        isStrikethrough: false,
      },
      heading4: {
        fontFamily: 'FangSong',
        fontSize: 22,
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        lineHeight: 1.5,
        textAlign: 'left',
        isUnderline: false,
        isStrikethrough: false,
      },
      normal: {
        fontFamily: 'FangSong',
        fontSize: 22,
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        lineHeight: 1.5,
        textAlign: 'left',
        isUnderline: false,
        isStrikethrough: false,
      },
    },
    defaultNumberingFormats: {
      heading1: {
        level: 1,
        format: '一、',
        text: '${number}、',
        start: 1,
        alignment: 'left',
        indentation: 2,
      },
      heading2: {
        level: 2,
        format: '（一）',
        text: '（${number}）',
        start: 1,
        alignment: 'left',
        indentation: 2,
      },
      heading3: {
        level: 3,
        format: '1.',
        text: '${number}.',
        start: 1,
        alignment: 'left',
        indentation: 2,
      },
      heading4: {
        level: 4,
        format: '（1）',
        text: '（${number}）',
        start: 1,
        alignment: 'left',
        indentation: 2,
      },
    },
  };

  return {
    documentId: 'doc-' + Date.now(),
    parseStatus: 'success',
    parsedDocument: a,
  };
};

export const saveTemplate = async (request: SaveTemplateRequest): Promise<SaveTemplateResponse> => {
  // 模拟保存模板
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    templateId: 'template-' + Date.now(),
    status: 'success',
  };
};
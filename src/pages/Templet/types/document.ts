export interface DocumentStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'baseline' | 'sub' | 'super';
  isUnderline: boolean;
  isStrikethrough: boolean;
  highlight?: string;
}

export interface ParagraphSpacing {
  before: number;
  after: number;
  lineSpacing: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineSpacingRule: 'atLeast' | 'exactly' | 'multiple';
}

export interface ParagraphIndentation {
  left: number;
  right: number;
  firstLine: number;
  hanging: number;
}

export interface NumberingFormat {
  level: number;
  format: string;
  text: string;
  start: number;
  restart?: number;
  alignment: 'left' | 'center' | 'right';
  indentation: number;
}

export interface TableCell {
  content: string;
  rowSpan?: number;
  colSpan?: number;
  style: DocumentStyle;
  borders?: {
    top?: { style: string; width: number; color: string };
    right?: { style: string; width: number; color: string };
    bottom?: { style: string; width: number; color: string };
    left?: { style: string; width: number; color: string };
  };
  backgroundColor?: string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

export interface TableRow {
  cells: TableCell[];
  height?: number;
  isHeader?: boolean;
}

export interface Table {
  rows: TableRow[];
  width: number | string;
  alignment: 'left' | 'center' | 'right';
  borders: {
    style: string;
    width: number;
    color: string;
  };
  cellSpacing?: number;
  cellPadding?: number;
}

export interface DocumentSection {
  id: string;
  type: 'paragraph' | 'heading' | 'table' | 'list' | 'pageBreak';
  content: string;
  level?: number;
  style: DocumentStyle;
  spacing: ParagraphSpacing;
  indentation: ParagraphIndentation;
  numbering?: NumberingFormat;
  table?: Table;
  isPageBreakBefore: boolean;
  isKeepWithNext: boolean;
  isKeepTogether: boolean;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  metadata?: {
    role?: string;
    language?: string;
    revision?: number;
    comments?: string[];
  };
}

export interface DocumentMetadata {
  title: string;
  author?: string;
  company?: string;
  category?: string;
  keywords?: string[];
  created: string;
  modified: string;
  lastModifiedBy?: string;
  revision: number;
  template?: string;
}

export interface DocumentSettings {
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    header: number;
    footer: number;
  };
  paperSize: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
  };
  defaultFontFamily: string;
  defaultFontSize: number;
  defaultLineSpacing: number;
  compatibility?: {
    useFarEastLayout?: boolean;
    useWordBreakForKinsoku?: boolean;
    useNormalStyleForList?: boolean;
  };
}

export interface ParsedDocument {
  metadata: DocumentMetadata;
  settings: DocumentSettings;
  sections: DocumentSection[];
  styles: {
    heading1: DocumentStyle;
    heading2: DocumentStyle;
    heading3: DocumentStyle;
    heading4: DocumentStyle;
    normal: DocumentStyle;
  };
  defaultNumberingFormats: {
    [key: string]: NumberingFormat;
  };
}
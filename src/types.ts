export interface ClipboardEntry {
  id: string;
  content: string;
  timestamp: number;
  type: 'text' | 'html' | 'image';
  source?: string;
  tags?: string[];
}

export interface Config {
  dataDir: string;
  maxHistorySize: number;
  autoSave: boolean;
  hotkeys: {
    toggleHistory: string;
    search: string;
  };
  gist?: {
    enabled: boolean;
    token?: string;
    gistId?: string;
  };
}

export interface SearchOptions {
  query: string;
  limit?: number;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
}

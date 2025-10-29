import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Config } from '../types';

const DEFAULT_CONFIG: Config = {
  dataDir: path.join(os.homedir(), '.copybuffer'),
  maxHistorySize: 1000,
  autoSave: true,
  hotkeys: {
    toggleHistory: 'F9',
    search: 'F10',
  },
  gist: {
    enabled: false,
  },
};

export class ConfigManager {
  private config: Config;
  private configPath: string;

  constructor() {
    this.configPath = path.join(os.homedir(), '.copybuffer', 'config.json');
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf-8');
        return { ...DEFAULT_CONFIG, ...JSON.parse(configData) };
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    return DEFAULT_CONFIG;
  }

  public saveConfig(config?: Partial<Config>): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    const configDir = path.dirname(this.configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
  }

  public getConfig(): Config {
    return this.config;
  }

  public updateConfig(updates: Partial<Config>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }
}

export const configManager = new ConfigManager();

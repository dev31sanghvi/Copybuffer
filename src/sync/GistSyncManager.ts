import * as https from 'https';
import { configManager } from '../config/ConfigManager';
import { storageManager } from '../storage/StorageManager';
import { ClipboardEntry } from '../types';

interface GistFile {
  content: string;
}

interface GistData {
  description: string;
  public: boolean;
  files: {
    [key: string]: GistFile;
  };
}

export class GistSyncManager {
  private apiUrl = 'https://api.github.com';

  public async syncToGist(): Promise<void> {
    const config = configManager.getConfig();
    
    if (!config.gist?.enabled || !config.gist?.token) {
      throw new Error('Gist sync is not enabled or token is missing');
    }

    const history = storageManager.loadHistory();
    const gistContent = JSON.stringify(history, null, 2);

    const gistData: GistData = {
      description: 'Copybuffer clipboard history',
      public: false,
      files: {
        'clipboard-history.json': {
          content: gistContent,
        },
      },
    };

    if (config.gist.gistId) {
      // Update existing gist
      await this.updateGist(config.gist.gistId, gistData, config.gist.token);
    } else {
      // Create new gist
      const gistId = await this.createGist(gistData, config.gist.token);
      configManager.updateConfig({
        gist: { ...config.gist, gistId },
      });
    }

    console.log('Successfully synced to GitHub Gist');
  }

  public async syncFromGist(): Promise<void> {
    const config = configManager.getConfig();
    
    if (!config.gist?.enabled || !config.gist?.token || !config.gist?.gistId) {
      throw new Error('Gist sync is not properly configured');
    }

    const gistContent = await this.getGist(config.gist.gistId, config.gist.token);
    const history: ClipboardEntry[] = JSON.parse(gistContent);
    
    // Import the history
    const existingHistory = storageManager.loadHistory();
    const mergedHistory = [...history, ...existingHistory];
    
    // Remove duplicates based on content
    const uniqueHistory = mergedHistory.filter(
      (entry, index, self) =>
        index === self.findIndex((e) => e.content === entry.content)
    );

    // Save merged history
    storageManager.loadHistory = () => uniqueHistory;
    
    console.log('Successfully synced from GitHub Gist');
  }

  private createGist(data: GistData, token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);

      const options = {
        hostname: 'api.github.com',
        path: '/gists',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          Authorization: `token ${token}`,
          'User-Agent': 'Copybuffer',
        },
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 201) {
            const response = JSON.parse(responseData);
            resolve(response.id);
          } else {
            reject(new Error(`Failed to create gist: ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  private updateGist(gistId: string, data: GistData, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);

      const options = {
        hostname: 'api.github.com',
        path: `/gists/${gistId}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          Authorization: `token ${token}`,
          'User-Agent': 'Copybuffer',
        },
      };

      const req = https.request(options, (res) => {
        res.on('data', () => {
          // Consume data to prevent memory leak
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`Failed to update gist: ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  private getGist(gistId: string, token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: `/gists/${gistId}`,
        method: 'GET',
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'Copybuffer',
        },
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            const response = JSON.parse(responseData);
            const content = response.files['clipboard-history.json']?.content;
            if (content) {
              resolve(content);
            } else {
              reject(new Error('Clipboard history file not found in gist'));
            }
          } else {
            reject(new Error(`Failed to get gist: ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }
}

export const gistSyncManager = new GistSyncManager();

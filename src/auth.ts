import { GoogleAuth } from 'google-auth-library';
import { photos_v1 } from 'googleapis';

export class GooglePhotosAuth {
  private auth: GoogleAuth;
  private photosClient: photos_v1.Photos | null = null;

  constructor() {
    this.auth = new GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/photoslibrary.appendonly',
        'https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata'
      ],
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async initialize(): Promise<void> {
    try {
      const authClient = await this.auth.getClient();
      this.photosClient = new photos_v1.Photos({ auth: authClient });
    } catch (error) {
      throw new Error(`Failed to initialize Google Photos client: ${error}`);
    }
  }

  getPhotosClient(): photos_v1.Photos {
    if (!this.photosClient) {
      throw new Error('Google Photos client not initialized. Call initialize() first.');
    }
    return this.photosClient;
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.photosClient) {
        await this.initialize();
      }
      
      await this.photosClient.albums.list({ pageSize: 1 });
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}
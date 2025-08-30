import { readFileSync } from 'fs';
import { GooglePhotosAuth } from './auth.js';
import {
  AlbumCreateRequest,
  AlbumResult,
  PhotoSearchRequest,
  PhotoUploadRequest,
  SearchResult,
  UploadResult,
} from './types.js';

export class GooglePhotosService {
  private auth: GooglePhotosAuth;

  constructor() {
    this.auth = new GooglePhotosAuth();
  }

  async initialize(): Promise<void> {
    await this.auth.initialize();
  }

  async testConnection(): Promise<boolean> {
    return await this.auth.testConnection();
  }

  async uploadPhoto(request: PhotoUploadRequest): Promise<UploadResult> {
    try {
      const photosClient = this.auth.getPhotosClient();
      
      const fileBuffer = readFileSync(request.filePath);
      
      const uploadResponse = await photosClient.mediaItems.upload({
        requestBody: fileBuffer,
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Goog-Upload-File-Name': request.filePath.split('/').pop() || 'photo',
          'X-Goog-Upload-Protocol': 'raw',
        },
      });

      if (!uploadResponse.data) {
        return {
          success: false,
          error: 'Upload failed - no upload token received',
        };
      }

      const uploadToken = uploadResponse.data as string;

      const newMediaItem: any = {
        description: request.description || '',
        simpleMediaItem: {
          fileName: request.filePath.split('/').pop() || 'photo',
          uploadToken: uploadToken,
        },
      };

      let createResponse;
      if (request.albumId) {
        createResponse = await photosClient.mediaItems.batchCreate({
          requestBody: {
            albumId: request.albumId,
            newMediaItems: [newMediaItem],
          },
        });
      } else {
        createResponse = await photosClient.mediaItems.batchCreate({
          requestBody: {
            newMediaItems: [newMediaItem],
          },
        });
      }

      if (createResponse.data?.newMediaItemResults?.[0]?.mediaItem) {
        return {
          success: true,
          mediaItem: createResponse.data.newMediaItemResults[0].mediaItem,
          uploadToken: uploadToken,
        };
      } else {
        return {
          success: false,
          error: 'Failed to create media item',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async createAlbum(request: AlbumCreateRequest): Promise<AlbumResult> {
    try {
      const photosClient = this.auth.getPhotosClient();
      
      const response = await photosClient.albums.create({
        requestBody: {
          album: {
            title: request.title,
            description: request.description || '',
          },
        },
      });

      if (response.data) {
        return {
          success: true,
          album: response.data,
        };
      } else {
        return {
          success: false,
          error: 'Failed to create album',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async listAlbums(options: { pageSize?: number; pageToken?: string } = {}): Promise<SearchResult> {
    try {
      const photosClient = this.auth.getPhotosClient();
      
      const response = await photosClient.albums.list({
        pageSize: options.pageSize || 25,
        pageToken: options.pageToken,
      });

      return {
        success: true,
        mediaItems: response.data.albums || [],
        nextPageToken: response.data.nextPageToken,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async searchPhotos(request: PhotoSearchRequest): Promise<SearchResult> {
    try {
      const photosClient = this.auth.getPhotosClient();
      
      const searchRequest: any = {
        pageSize: request.pageSize || 25,
        pageToken: request.pageToken,
      };

      if (request.albumId) {
        searchRequest.albumId = request.albumId;
      }

      const response = await photosClient.mediaItems.search({
        requestBody: searchRequest,
      });

      return {
        success: true,
        mediaItems: response.data.mediaItems || [],
        nextPageToken: response.data.nextPageToken,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async getPhotoInfo(mediaItemId: string): Promise<UploadResult> {
    try {
      const photosClient = this.auth.getPhotosClient();
      
      const response = await photosClient.mediaItems.get({
        mediaItemId: mediaItemId,
      });

      if (response.data) {
        return {
          success: true,
          mediaItem: response.data,
        };
      } else {
        return {
          success: false,
          error: 'Media item not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
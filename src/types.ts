import { photos_v1 } from 'googleapis';

export interface PhotoUploadRequest {
  filePath: string;
  description?: string;
  albumId?: string;
}

export interface AlbumCreateRequest {
  title: string;
  description?: string;
}

export interface PhotoSearchRequest {
  albumId?: string;
  pageSize?: number;
  pageToken?: string;
}

export interface UploadResult {
  success: boolean;
  mediaItem?: photos_v1.Schema$MediaItem;
  uploadToken?: string;
  error?: string;
}

export interface AlbumResult {
  success: boolean;
  album?: photos_v1.Schema$Album;
  error?: string;
}

export interface SearchResult {
  success: boolean;
  mediaItems?: photos_v1.Schema$MediaItem[];
  nextPageToken?: string;
  error?: string;
}
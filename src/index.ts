#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { GooglePhotosService } from './service.js';

class GooglePhotosMCPServer {
  private server: Server;
  private googlePhotosService: GooglePhotosService;

  constructor() {
    this.server = new Server(
      {
        name: 'google-photos-mcp-server',
        version: '1.0.0',
        description: 'MCP server for Google Photos API integration (2025 limitations compliant)',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.googlePhotosService = new GooglePhotosService();
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'upload_photo',
          description: 'Upload a photo to Google Photos from a local file path',
          inputSchema: {
            type: 'object',
            properties: {
              filePath: {
                type: 'string',
                description: 'Local file path to the photo to upload',
              },
              description: {
                type: 'string',
                description: 'Optional description for the photo',
              },
              albumId: {
                type: 'string',
                description: 'Optional album ID to add the photo to',
              },
            },
            required: ['filePath'],
          },
        },
        {
          name: 'create_album',
          description: 'Create a new album in Google Photos',
          inputSchema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'Title of the album',
              },
              description: {
                type: 'string',
                description: 'Optional description for the album',
              },
            },
            required: ['title'],
          },
        },
        {
          name: 'list_albums',
          description: 'List albums created by this app',
          inputSchema: {
            type: 'object',
            properties: {
              pageSize: {
                type: 'number',
                description: 'Number of albums to return (max 50)',
                maximum: 50,
              },
              pageToken: {
                type: 'string',
                description: 'Token for pagination',
              },
            },
          },
        },
        {
          name: 'search_photos',
          description: 'Search photos created by this app',
          inputSchema: {
            type: 'object',
            properties: {
              albumId: {
                type: 'string',
                description: 'Optional album ID to search within',
              },
              pageSize: {
                type: 'number',
                description: 'Number of photos to return (max 100)',
                maximum: 100,
              },
              pageToken: {
                type: 'string',
                description: 'Token for pagination',
              },
            },
          },
        },
        {
          name: 'get_photo_info',
          description: 'Get detailed information about a specific photo',
          inputSchema: {
            type: 'object',
            properties: {
              mediaItemId: {
                type: 'string',
                description: 'ID of the media item to get information for',
              },
            },
            required: ['mediaItemId'],
          },
        },
        {
          name: 'test_connection',
          description: 'Test the connection to Google Photos API',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'upload_photo': {
            const result = await this.googlePhotosService.uploadPhoto({
              filePath: args.filePath as string,
              description: args.description as string | undefined,
              albumId: args.albumId as string | undefined,
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'create_album': {
            const result = await this.googlePhotosService.createAlbum({
              title: args.title as string,
              description: args.description as string | undefined,
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'list_albums': {
            const result = await this.googlePhotosService.listAlbums({
              pageSize: args.pageSize as number | undefined,
              pageToken: args.pageToken as string | undefined,
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'search_photos': {
            const result = await this.googlePhotosService.searchPhotos({
              albumId: args.albumId as string | undefined,
              pageSize: args.pageSize as number | undefined,
              pageToken: args.pageToken as string | undefined,
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'get_photo_info': {
            const result = await this.googlePhotosService.getPhotoInfo(
              args.mediaItemId as string
            );
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'test_connection': {
            const result = await this.googlePhotosService.testConnection();
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ connected: result }, null, 2),
                },
              ],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  async run() {
    try {
      await this.googlePhotosService.initialize();
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error('Google Photos MCP server running on stdio');
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

const server = new GooglePhotosMCPServer();
server.run().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
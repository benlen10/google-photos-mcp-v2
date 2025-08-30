# Google Photos MCP Server

A Model Context Protocol (MCP) server that provides integration with Google Photos API, compliant with the 2025 API limitations and changes.

## ⚠️ Important API Limitations (2025 Updates)

As of March 31, 2025, Google Photos API has significant limitations:

- **Cannot access existing photos**: The API can only access photos uploaded by your specific app
- **No library browsing**: Cannot browse or search your existing Google Photos library  
- **Read-only scopes removed**: `photoslibrary.readonly` and similar scopes are deprecated
- **App-created content only**: Only albums and photos created through this MCP server are accessible

This MCP server is designed to work within these constraints, focusing on:
- Uploading new photos to Google Photos
- Creating and managing albums for app-uploaded content
- Searching within app-created photos and albums

## Features

- **Photo Upload**: Upload local photos to Google Photos with optional descriptions
- **Album Management**: Create albums and organize uploaded photos
- **Content Search**: Search through app-created photos and albums
- **Metadata Access**: Get detailed information about uploaded photos
- **Connection Testing**: Verify API connectivity and authentication

## Prerequisites

1. **Google Cloud Project** with Photos Library API enabled
2. **Service Account** or **OAuth 2.0 credentials** 
3. **Node.js 18+** and **npm**

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Photos Library API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Photos Library API" 
   - Click "Enable"

### 2. Authentication Setup

#### Option A: Service Account (Recommended)
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details and create
4. Download the JSON key file
5. Set environment variable: `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/keyfile.json`

#### Option B: OAuth 2.0 (For personal use)
1. Create OAuth 2.0 client credentials
2. Download the credentials JSON file
3. Set `GOOGLE_APPLICATION_CREDENTIALS` to point to this file

### 3. Installation

```bash
# Clone or download the project
cd google-photos-mcp-v2

# Install dependencies
npm install

# Build the project
npm run build
```

### 4. Claude Desktop Configuration

Add to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "google-photos": {
      "command": "node",
      "args": ["/path/to/google-photos-mcp-v2/build/index.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/your/credentials.json"
      }
    }
  }
}
```

## Available Tools

### `upload_photo`
Upload a photo from local file system to Google Photos.

**Parameters:**
- `filePath` (required): Local path to the photo file
- `description` (optional): Description for the photo
- `albumId` (optional): Album ID to add the photo to

### `create_album`  
Create a new album in Google Photos.

**Parameters:**
- `title` (required): Album title
- `description` (optional): Album description

### `list_albums`
List albums created by this app.

**Parameters:**
- `pageSize` (optional): Number of albums to return (max 50)
- `pageToken` (optional): Token for pagination

### `search_photos`
Search photos uploaded by this app.

**Parameters:**
- `albumId` (optional): Search within specific album
- `pageSize` (optional): Number of photos to return (max 100)  
- `pageToken` (optional): Token for pagination

### `get_photo_info`
Get detailed information about a specific photo.

**Parameters:**
- `mediaItemId` (required): ID of the media item

### `test_connection`
Test the connection to Google Photos API.

**Parameters:** None

## Usage Examples

### Upload a Photo
```
Can you upload the photo at /Users/me/vacation.jpg to Google Photos with the description "Beach sunset"?
```

### Create an Album and Add Photos
```
Create a new album called "Vacation 2024" and upload all photos from my /Users/me/vacation_photos/ folder to it.
```

### Search Photos
```
Show me all the photos I've uploaded through this app.
```

## Troubleshooting

### Authentication Issues
- Verify `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set correctly
- Ensure the credentials file has proper permissions
- Check that Photos Library API is enabled in Google Cloud Console

### Upload Failures
- Verify file paths are correct and accessible
- Check file format is supported by Google Photos
- Ensure sufficient storage quota in Google Photos

### Empty Results
- Remember: This app can only see content it has uploaded
- Existing photos in your Google Photos library are not accessible
- Use Google Photos Picker API for selecting existing photos (requires web interface)

## API Limitations & Alternatives

Due to 2025 API changes, this MCP server cannot:
- Browse your existing Google Photos library
- Search through photos you didn't upload via this app  
- Access photos uploaded by other applications

**For accessing existing photos**, Google recommends using the new **Photos Picker API**, which requires a web interface for user interaction.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run in development
npm run dev

# Clean build
npm run clean
```

## Security Notes

- Keep your credentials file secure and never commit it to version control
- Use service accounts for production deployments
- Regularly rotate API keys and credentials
- Review Google's Photos API User Data and Developer Policy

## License

MIT License - see LICENSE file for details.

## Support

For issues with this MCP server, please check:
1. Google Photos API documentation
2. MCP specification at [modelcontextprotocol.io](https://modelcontextprotocol.io)
3. Authentication setup guides in Google Cloud Console
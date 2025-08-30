# Google Photos MCP Server - Claude Setup Guide

## Quick Setup for Claude Desktop

This MCP server provides Google Photos integration for Claude Desktop, working within the 2025 API limitations.

### 1. Prerequisites Setup

**Required:**
- Node.js 18+ installed
- Google Cloud Project with Photos Library API enabled
- Service Account credentials JSON file

**Get Google Photos API Access:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable "Photos Library API" 
3. Create Service Account → Download JSON credentials
4. Save credentials to safe location (e.g., `~/.google/google-photos-credentials.json`)

### 2. Installation

```bash
# In the project directory
npm install
npm run build
```

### 3. Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "google-photos": {
      "command": "node", 
      "args": ["/Users/blenington/GitHub/google-photos-mcp-v2/build/index.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/your/credentials.json"
      }
    }
  }
}
```

**Replace paths:**
- Update the `args` path to match your actual project location
- Update `GOOGLE_APPLICATION_CREDENTIALS` to your credentials file location

### 4. Restart Claude Desktop

After updating the config, restart Claude Desktop to load the MCP server.

## What You Can Do

### Upload Photos
```
Upload my photo at ~/vacation.jpg to Google Photos
```

### Create Albums  
```
Create an album called "Summer 2024" and upload all photos from ~/summer_photos/
```

### Search Your Uploads
```
Show me all the photos I've uploaded through this MCP server
```

### Get Photo Details
```
Get detailed information about photo ID: ABC123XYZ
```

## Important Limitations (2025 API Changes)

⚠️ **This server can ONLY access photos you upload through it**

**Cannot do:**
- Browse your existing Google Photos library
- Search through old photos  
- Access photos uploaded by other apps
- Use read-only access to your library

**Can do:**
- Upload new photos from your computer
- Create albums for uploaded photos
- Search through app-uploaded content
- Get metadata for uploaded photos

## Troubleshooting

### "Connection failed" errors
- Check `GOOGLE_APPLICATION_CREDENTIALS` path is correct
- Verify Photos Library API is enabled in Google Cloud
- Ensure credentials file has proper read permissions

### "No photos found" 
- This is normal! The server only sees photos it uploaded
- Upload some photos first, then search will work

### Server won't start
- Verify Node.js 18+ is installed: `node --version` 
- Check project was built: `npm run build`
- Ensure all paths in config are absolute paths

## File Structure Reference

```
google-photos-mcp-v2/
├── build/           # Compiled JavaScript (created by npm run build)
├── src/             # TypeScript source code  
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
├── README.md        # Full documentation
└── CLAUDE.md        # This quick setup guide
```

## Quick Test

After setup, try this in Claude Desktop:
```
Test the connection to Google Photos API
```

If successful, you'll see `{"connected": true}`.

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run build` | Compile TypeScript |
| `npm run dev` | Build and run once |  
| `npm run clean` | Remove build files |

For detailed information, see the full README.md file.
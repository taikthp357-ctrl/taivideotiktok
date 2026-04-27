# API Contract

## POST /api/resolve

### Request
```json
{
  "url": "https://www.tiktok.com/@user/video/123",
  "accept_terms": true
}
```

### Response: ready
```json
{
  "status": "ready",
  "platform": "tiktok",
  "title": "Video title",
  "thumbnail": "https://...",
  "items": [
    {
      "label": "HD Video",
      "quality": "1080p",
      "format": "mp4",
      "download_url": "https://...",
      "expires_in": 900
    }
  ]
}
```

### Response: metadata_only
```json
{
  "status": "metadata_only",
  "platform": "youtube",
  "thumbnail": "https://...",
  "embed_url": "https://www.youtube.com/embed/...",
  "reason": "YouTube download is disabled by default. Metadata and embed are available."
}
```

### Response: blocked
```json
{
  "status": "blocked",
  "platform": "unknown",
  "reason": "Unsupported URL or missing usage confirmation."
}
```

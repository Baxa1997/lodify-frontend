# Chat Message Types - Implementation Guide

## Overview

The chat system now supports multiple message types with automatic type detection and proper rendering:

- **Text messages** (default)
- **Image messages**
- **Video messages**
- **Audio messages**
- **File attachments** (documents, PDFs, etc.)

---

## 🎨 Message Component Redesigns

### 1. **ImageMessage**

- Displays actual images (not placeholders)
- Clickable to open in new tab
- Hover effect with scale animation
- Max dimensions: 350x350px
- Shows filename below image

### 2. **FileMessage**

- Smart file type icons based on extension (📄 PDF, 📝 DOC, 📊 XLS, etc.)
- Shows file name and size
- Download icon
- Hover effect for better UX
- Clickable to download
- File size formatting (KB/MB)

### 3. **VideoMessage**

- Native HTML5 video player with controls
- 16:9 aspect ratio
- Max width: 400px
- Supports MP4, WebM, OGG formats
- Shows filename below video

### 4. **AudioMessage**

- Native HTML5 audio player with controls
- Shows audio icon 🎵
- Displays filename
- Supports MP3, OGG, WAV formats
- Full-width audio controls

---

## 📤 File Upload Implementation

### MessageInput Component Updates

**New Features:**

- Attachment button (📎 icon)
- File picker supporting:
  - Images: `image/*`
  - Videos: `video/*`
  - Audio: `audio/*`
  - Documents: `.pdf, .doc, .docx, .xls, .xlsx, .txt, .zip, .rar`
- File size validation (max 10MB)
- Upload progress indicator
- Clear file button
- Toast notifications for success/error

**Automatic Type Detection:**

```javascript
const getFileType = (file) => {
  const mimeType = file.type;

  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "file";
};
```

---

## 🔌 Socket Message Format

### Sending Messages with Type

**Text Message:**

```javascript
{
  room_id: "room-123",
  content: "Hello!",
  from: "username",
  type: "text",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

**File Message (Image/Video/Audio/File):**

```javascript
{
  room_id: "room-123",
  content: "https://example.com/file.jpg",
  from: "username",
  type: "image", // or "video", "audio", "file"
  timestamp: "2024-01-01T00:00:00.000Z",
  fileInfo: {
    name: "photo.jpg",
    size: 1234567,
    type: "image/jpeg",
    url: "https://example.com/file.jpg"
  }
}
```

---

## ✅ File Upload Service Integration

The chat now uses the **`fileService.folderUpload`** method to upload all files to your CDN.

### How It Works

```javascript
import fileService from "@services/fileService";

const handleFileSend = async () => {
  // Prepare FormData
  const formData = new FormData();
  formData.append("file", selectedFile);

  // Upload to CDN using fileService
  const response = await fileService.folderUpload(formData, {
    folder_name: "chat", // Files stored in "chat" folder
  });

  // Construct full URL
  const fileUrl = `https://cdn.u-code.io/${response?.link}`;
  const fileType = getFileType(selectedFile); // auto-detected

  // Send message with file info
  onSendMessage(fileUrl, fileType, {
    name: selectedFile.name,
    size: selectedFile.size,
    type: selectedFile.type,
    url: fileUrl,
  });
};
```

### Upload Configuration

- **Folder:** All chat files are uploaded to the `chat` folder
- **CDN URL:** `https://cdn.u-code.io/`
- **Supported types:** Images, videos, audio files, and documents
- **Max file size:** 10MB (configurable)

---

## 🎯 Usage

### Sending a Text Message

```javascript
onSendMessage("Hello world", "text");
```

### Sending a File

```javascript
onSendMessage(fileUrl, "image", {
  name: "photo.jpg",
  size: 1234567,
  type: "image/jpeg",
  url: fileUrl,
});
```

---

## 🔧 Component Props

### All Message Components Accept:

- `isOwn`: boolean - Whether the message is from current user
- `content`: string - The message content or file URL
- `fileInfo`: object - File metadata (for non-text messages)
  - `name`: File name
  - `size`: File size in bytes
  - `type`: MIME type
  - `url`: File URL

---

## ✨ Features

✅ Automatic type detection based on MIME type  
✅ File size validation (10MB limit)  
✅ Toast notifications for errors/success  
✅ Loading states during upload  
✅ Clear file selection  
✅ Responsive design  
✅ Hover effects and animations  
✅ Download support for files  
✅ Native media players for audio/video

---

## 📝 Next Steps

1. ✅ ~~**Implement file upload service**~~ (COMPLETED - using fileService.folderUpload)
2. **Test with different file types** (images, videos, audio, documents)
3. **Test file uploads in production environment**
4. **Adjust max file size if needed** (currently 10MB)
5. **Add file type restrictions if needed**
6. **Implement file compression for images** (optional)
7. **Add thumbnail generation** (optional)
8. **Implement progress tracking for large files** (optional)

---

## 🐛 Debugging

Check browser console for logs:

- Message type being sent
- File upload progress
- Component rendering
- Type detection results

Example logs:

```
Sending message with type: image {...}
MessageBubble rendering with type: image Component: ImageMessage
```

---

## 🎨 Customization

### Change File Size Limit

In `MessageInput.jsx`:

```javascript
const maxSize = 20 * 1024 * 1024; // Change to 20MB
```

### Add More File Icons

In `FileMessage.jsx`:

```javascript
const iconMap = {
  pdf: "📄",
  doc: "📝",
  psd: "🎨", // Add your custom icons
  // ...
};
```

### Adjust Image Dimensions

In `ImageMessage.jsx`:

```javascript
maxW = "500px"; // Change max width
maxH = "500px"; // Change max height
```

# CuriumOS

CuriumOS is a high-performance, web-based operating system built with React, TypeScript, and the Gemini API. It features a virtual file system (VFS), a modular application architecture, and deep integration with Google Generative AI for intelligent system features.

## 🚀 Deployment Configuration

To deploy CuriumOS to Cloudflare Pages with Worker functions, use the following `wrangler.jsonc` configuration. Create this file in your project root:

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "curium-os",
  "main": "worker.ts",
  "compatibility_date": "2025-05-15",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  },
  "kv_namespaces": [
    {
      "binding": "CURIUM_KV",
      "id": "YOUR_KV_NAMESPACE_ID"
    }
  ],
  "observability": {
    "enabled": true
  }
}
```

## 🛠 System Architecture

### 1. The Kernel (`services/Kernel.ts`)
The Kernel manages the global state of the OS, including user authentication, session persistence, and application usage tracking. It interfaces with `CloudStorage` to ensure user profiles are synchronized across devices.

### 2. Virtual File System (`services/FileSystem.ts`)
CuriumOS operates on a virtualized directory structure stored in the browser's `LocalStorage`. It supports:
- **System Binaries**: Critical files in `/sys` required for booting.
- **Desktop**: A special folder in `/home/user/desktop` that dynamically renders icons on the main workspace.
- **Applications**: `.app` pointer files that trigger the UI Shell to mount specific React components.

### 3. Intelligence Layer
The OS leverages the Gemini API (`gemini-3-flash-preview` and `gemini-2.5-flash-lite-latest`) for:
- **AI Assistant**: A native chat interface.
- **Maps Grounding**: Real-time location search and descriptions in the Maps app.
- **Weather Service**: Search-grounded atmospheric reports.

## 📂 Desktop Management

CuriumOS features a "Physicalized" Desktop folder.
- **Installing**: Use the **App Store** to provision new capabilities. This writes a `.app` file to the Desktop.
- **Uninstalling**: Deleting an app icon from the Desktop folder (via Files or Terminal) removes the capability and makes it available for re-provisioning in the Store.

## ⌨️ Terminal Commands

The system shell supports standard UNIX-like interactions:
- `ls`: List files in the current directory.
- `rm [path]`: Delete a file (e.g., `rm /home/user/desktop/maps.app`).
- `open [app_id]`: Force-launch a system module.
- `reset-system`: Restores corrupted system binaries from the recovery partition.

---
*© 2025 Curium Systems. All rights reserved.*

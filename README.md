# CuriumOS

CuriumOS is a high-performance, web-based operating system featuring a virtual file system (VFS), system corruption simulation, and a modular application architecture integrated with Gemini AI.

## 🚀 Deployment Configuration

To deploy CuriumOS to Cloudflare Pages, the following `wrangler.jsonc` configuration is required in the root directory:

```json
{
  "name": "curiumos",
  "pages_build_output_dir": "dist",
  "compatibility_date": "2025-05-15",
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "kv_namespaces": [
    {
      "binding": "CURIUM_KV",
      "id": "cf64a753630d41829e083c0f86235161"
    }
  ],
  "observability": {
    "enabled": true
  }
}
```

### ⚠️ Important: Deployment Command
If you receive an error stating *"It looks like you've run a Workers-specific command in a Pages project"*, ensure you are using the Pages deployment command:

```bash
wrangler pages deploy dist
```

## 🛠 System Architecture

### 1. The Kernel (`services/Kernel.ts`)
The central management layer for user sessions and system state. It uses Cloudflare Pages Functions (`/functions/api/profile.ts`) to persist user profiles to KV storage.

### 2. Virtual File System (`services/FileSystem.ts`)
A robust `/sys` and `/home` directory structure simulated in browser storage. Includes integrity checking that triggers OS-wide "glitch" states if critical files are removed.

### 3. AI Services
Native apps like **AI Assistant**, **Maps**, and **Weather** leverage Google's Gemini API for real-time intelligence and grounding.

## 📂 Desktop & Apps
- **VFS Path**: `/home/user/desktop`
- **Installation**: Apps can be "provisioned" via the **App Store**, which writes an executable pointer to the VFS.
- **Removal**: Deleting an app file from the Desktop folder uninstalls the capability.

## ⌨️ Terminal
A fully functional shell supporting:
- `ls`, `cd`, `pwd`, `mkdir`, `touch`, `rm`, `cat`, `open`, `neofetch`, `reboot`, `reset-system`.

---
*© 2025 Curium Systems. All rights reserved.*
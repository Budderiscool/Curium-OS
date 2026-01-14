import { VFile, FileType } from '../types';
import { SYSTEM_FILES } from '../constants';

class FileSystemService {
  private files: VFile[] = [];

  constructor() {
    this.load();
  }

  private load() {
    const stored = localStorage.getItem('curium_fs');
    if (stored) {
      this.files = JSON.parse(stored);
    } else {
      this.files = [...SYSTEM_FILES];
      // Add more critical breakage files
      this.files.push({ name: 'fonts.dll', path: '/sys/ui/fonts.dll', type: FileType.SYSTEM, isCritical: true, content: 'FONT_RASTERIZER_v1' });
      this.generateMassiveSystem();
      this.save();
    }
  }

  private generateMassiveSystem() {
    const prefixes = ['lib', 'bin', 'src', 'driver', 'mod', 'cache', 'log', 'srv', 'ext', 'cfg'];
    const subdirs = ['network', 'audio', 'video', 'core', 'security', 'virt', 'hid', 'ui', 'kernel', 'usr', 'opt'];
    
    for (let i = 0; i < 3000; i++) {
      const prefix = prefixes[i % prefixes.length];
      const subdir = subdirs[Math.floor(Math.random() * subdirs.length)];
      const name = `${prefix}_${i.toString().padStart(4, '0')}.${i % 5 === 0 ? 'dll' : 'sys'}`;
      const path = `/sys/${subdir}/${name}`;
      
      // Don't overwrite manually defined system files
      if (this.files.find(f => f.path === path)) continue;

      this.files.push({
        name,
        path,
        type: FileType.SYSTEM,
        isCritical: Math.random() > 0.99,
        content: `CURIUM_BLOB_${Math.random().toString(16).slice(2, 12).toUpperCase()}`
      });
    }
  }

  private save() {
    localStorage.setItem('curium_fs', JSON.stringify(this.files));
  }

  getFiles(): VFile[] {
    return this.files;
  }

  getFilesInDirectory(path: string): VFile[] {
    const normalizedPath = path === '/' ? '/' : (path.endsWith('/') ? path : path + '/');
    
    // Find files directly in this directory
    const directFiles = this.files.filter(f => {
      if (f.path === path) return false;
      if (!f.path.startsWith(normalizedPath)) return false;
      const subPath = f.path.slice(normalizedPath.length);
      return !subPath.includes('/');
    });

    // Find "implicit" directories (e.g., if /sys/core/file exists, 'sys' should be in /)
    const subdirs = new Set<string>();
    this.files.forEach(f => {
      if (f.path.startsWith(normalizedPath) && f.path !== path) {
        const subPath = f.path.slice(normalizedPath.length);
        const firstSlashIndex = subPath.indexOf('/');
        if (firstSlashIndex !== -1) {
          subdirs.add(subPath.slice(0, firstSlashIndex));
        }
      }
    });

    // Convert subdir strings to VFile objects
    const dirFiles: VFile[] = Array.from(subdirs).map(name => ({
      name,
      path: normalizedPath + name,
      type: FileType.DIRECTORY
    }));

    // Merge and remove duplicates (where a folder might be explicitly defined in constants)
    const result = [...dirFiles];
    directFiles.forEach(df => {
      if (!result.find(r => r.path === df.path)) {
        result.push(df);
      }
    });

    return result.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === FileType.DIRECTORY ? -1 : 1;
    });
  }

  getFile(path: string): VFile | undefined {
    return this.files.find(f => f.path === path);
  }

  writeFile(path: string, content: string, type: FileType = FileType.FILE, isCritical = false) {
    const existing = this.getFile(path);
    if (existing) {
      existing.content = content;
    } else {
      const parts = path.split('/');
      const name = parts[parts.length - 1];
      this.files.push({ name, path, content, type, isCritical });
    }
    this.save();
    window.dispatchEvent(new CustomEvent('curium_fs_changed'));
  }

  deleteFile(path: string) {
    const file = this.getFile(path);
    
    // If it's a directory, delete everything inside it too
    const isDir = !file || file.type === FileType.DIRECTORY;
    const normalizedPath = path.endsWith('/') ? path : path + '/';
    
    const countBefore = this.files.length;
    this.files = this.files.filter(f => {
      const shouldDelete = f.path === path || f.path.startsWith(normalizedPath);
      if (shouldDelete && f.isCritical) {
         window.dispatchEvent(new CustomEvent('curium_system_failure'));
      }
      return !shouldDelete;
    });

    this.save();
    window.dispatchEvent(new CustomEvent('curium_fs_changed', { detail: { deleted: path } }));
  }

  reset() {
    localStorage.removeItem('curium_fs');
    this.files = [...SYSTEM_FILES];
    this.files.push({ name: 'fonts.dll', path: '/sys/ui/fonts.dll', type: FileType.SYSTEM, isCritical: true, content: 'FONT_RASTERIZER_v1' });
    this.generateMassiveSystem();
    this.save();
    window.dispatchEvent(new CustomEvent('curium_fs_changed'));
  }

  exists(path: string): boolean {
    return this.files.some(f => f.path === path);
  }

  getIntegrityReport() {
    return {
      hasKernel: this.exists('/sys/boot/kernel.sys'),
      hasShell: this.exists('/sys/bin/shell.exe'),
      hasIcons: this.exists('/sys/ui/icons.dll'),
      hasMenu: this.exists('/sys/ui/menu.srv'),
      hasFonts: this.exists('/sys/ui/fonts.dll')
    };
  }
}

export const fs = new FileSystemService();
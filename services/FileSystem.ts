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
      this.save();
    }
  }

  private save() {
    localStorage.setItem('curium_fs', JSON.stringify(this.files));
  }

  getFiles(): VFile[] {
    return this.files;
  }

  getFilesInDirectory(path: string): VFile[] {
    const normalizedPath = path.endsWith('/') ? path : path + '/';
    return this.files.filter(f => {
      if (f.path === path) return false;
      if (!f.path.startsWith(normalizedPath)) return false;
      const subPath = f.path.slice(normalizedPath.length);
      return !subPath.includes('/');
    });
  }

  getFile(path: string): VFile | undefined {
    return this.files.find(f => f.path === path);
  }

  writeFile(path: string, content: string, type: FileType = FileType.FILE) {
    const existing = this.getFile(path);
    if (existing) {
      existing.content = content;
    } else {
      const parts = path.split('/');
      const name = parts[parts.length - 1];
      this.files.push({ name, path, content, type });
    }
    this.save();
    window.dispatchEvent(new CustomEvent('curium_fs_changed'));
  }

  deleteFile(path: string) {
    this.files = this.files.filter(f => f.path !== path);
    this.save();
    window.dispatchEvent(new CustomEvent('curium_fs_changed', { detail: { deleted: path } }));
  }

  reset() {
    this.files = [...SYSTEM_FILES];
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
    };
  }
}

export const fs = new FileSystemService();
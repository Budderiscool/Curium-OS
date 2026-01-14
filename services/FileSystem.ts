
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
      this.generateAppDependencies();
      this.generateMassiveSystem();
      this.save();
    }
  }

  private generateAppDependencies() {
    const apps = [
      'terminal', 'explorer', 'settings', 'browser', 'store', 'editor', 
      'ai', 'taskmgr', 'maps', 'calc', 'media', 'weather', 'clock', 
      'notes', 'gallery', 'sysinfo'
    ];

    apps.forEach(appId => {
      const base = `/sys/apps/${appId}`;
      const deps = [
        { name: 'icons.bin', path: `${base}/icons.bin`, isCritical: true },
        { name: 'fonts.bin', path: `${base}/fonts.bin`, isCritical: true },
        { name: 'images.bin', path: `${base}/images.bin`, isCritical: true },
      ];
      deps.forEach(d => {
        this.files.push({ ...d, type: FileType.SYSTEM, content: `APP_RESOURCE_BLOB_${appId}` });
      });
    });
  }

  private generateMassiveSystem() {
    const prefixes = ['lib', 'bin', 'src', 'driver', 'mod', 'cache', 'log', 'srv', 'ext', 'cfg'];
    const subdirs = ['network', 'audio', 'video', 'core', 'security', 'virt', 'hid', 'ui', 'kernel', 'usr', 'opt'];
    
    for (let i = 0; i < 2000; i++) {
      const prefix = prefixes[i % prefixes.length];
      const subdir = subdirs[Math.floor(Math.random() * subdirs.length)];
      const name = `${prefix}_${i.toString().padStart(4, '0')}.${i % 5 === 0 ? 'dll' : 'sys'}`;
      const path = `/sys/${subdir}/${name}`;
      
      if (this.files.find(f => f.path === path)) continue;

      this.files.push({
        name,
        path,
        type: FileType.SYSTEM,
        isCritical: Math.random() > 0.995,
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
    const directFiles = this.files.filter(f => {
      if (f.path === path) return false;
      if (!f.path.startsWith(normalizedPath)) return false;
      const subPath = f.path.slice(normalizedPath.length);
      return !subPath.includes('/');
    });

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

    const dirFiles: VFile[] = Array.from(subdirs).map(name => ({
      name,
      path: normalizedPath + name,
      type: FileType.DIRECTORY
    }));

    return [...dirFiles, ...directFiles].sort((a, b) => {
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
    const normalizedPath = path.endsWith('/') ? path : path + '/';
    this.files = this.files.filter(f => {
      const shouldDelete = f.path === path || f.path.startsWith(normalizedPath);
      if (shouldDelete && f.isCritical) {
         window.dispatchEvent(new CustomEvent('curium_system_failure', { detail: { path: f.path } }));
      }
      return !shouldDelete;
    });

    this.save();
    window.dispatchEvent(new CustomEvent('curium_fs_changed', { detail: { deleted: path } }));
  }

  reset() {
    localStorage.removeItem('curium_fs');
    this.files = [...SYSTEM_FILES];
    this.generateAppDependencies();
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
      hasIcons: this.exists('/sys/icons/main_set.dll'),
      hasMenu: this.exists('/sys/ui/menu.srv'),
      hasFonts: this.exists('/sys/fonts/segoe_ui.ttf'),
      hasUIHandler: this.exists('/sys/bin/ui_handler.srv'),
      hasWindowHandler: this.exists('/sys/bin/window_handler.srv'),
      hasAppManager: this.exists('/sys/bin/app_manager.srv'),
      hasImages: this.exists('/sys/images/wallpaper_system.img'),
      hasUI: this.exists('/sys/ui/compositor.sys')
    };
  }

  checkAppIntegrity(appId: string) {
    const base = `/sys/apps/${appId}`;
    return {
      hasIcons: this.exists(`${base}/icons.bin`),
      hasFonts: this.exists(`${base}/fonts.bin`),
      hasImages: this.exists(`${base}/images.bin`),
    };
  }
}

export const fs = new FileSystemService();

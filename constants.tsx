
import { FileType, VFile } from './types';

export const SYSTEM_FILES: VFile[] = [
  { name: 'kernel.sys', path: '/sys/boot/kernel.sys', type: FileType.SYSTEM, isCritical: true, content: 'SYSTEM_CORE_0xFF1A' },
  { name: 'shell.exe', path: '/sys/bin/shell.exe', type: FileType.SYSTEM, isCritical: true, content: 'UI_SHELL_MODULE' },
  { name: 'ui_handler.srv', path: '/sys/bin/ui_handler.srv', type: FileType.SYSTEM, isCritical: true, content: 'UI_COMPOSITOR_SERVICE' },
  { name: 'menu.srv', path: '/sys/ui/menu.srv', type: FileType.SYSTEM, isCritical: true, content: 'CONTEXT_MENU_HANDLER' },
  { name: 'compositor.sys', path: '/sys/ui/compositor.sys', type: FileType.SYSTEM, isCritical: true, content: 'GFX_COMP_V1' },
  { name: 'fstab', path: '/etc/fstab', type: FileType.SYSTEM, isCritical: true, content: 'UUID=root / ext4 defaults 1 1' },
  
  // Folders
  { name: 'desktop', path: '/home/user/desktop', type: FileType.DIRECTORY },
  { name: 'fonts', path: '/sys/fonts', type: FileType.DIRECTORY },
  { name: 'icons', path: '/sys/icons', type: FileType.DIRECTORY },
  { name: 'images', path: '/sys/images', type: FileType.DIRECTORY },
  { name: 'ui', path: '/sys/ui', type: FileType.DIRECTORY },

  // Critical Resources
  { name: 'wallpaper_system.img', path: '/sys/images/wallpaper_system.img', type: FileType.SYSTEM, isCritical: true, content: 'BLOB_DATA_IMG_001' },

  // Pre-installed Apps on Desktop
  { name: 'Terminal.app', path: '/home/user/desktop/terminal.app', type: FileType.APP, content: 'terminal', icon: 'fa-terminal' },
  { name: 'Files.app', path: '/home/user/desktop/explorer.app', type: FileType.APP, content: 'explorer', icon: 'fa-folder' },
  { name: 'Settings.app', path: '/home/user/desktop/settings.app', type: FileType.APP, content: 'settings', icon: 'fa-cog' },
  { name: 'Browser.app', path: '/home/user/desktop/browser.app', type: FileType.APP, content: 'browser', icon: 'fa-globe' },
  { name: 'Store.app', path: '/home/user/desktop/store.app', type: FileType.APP, content: 'store', icon: 'fa-shopping-bag' },
  { name: 'Editor.app', path: '/home/user/desktop/editor.app', type: FileType.APP, content: 'editor', icon: 'fa-file-lines' },
  { name: 'AI.app', path: '/home/user/desktop/ai.app', type: FileType.APP, content: 'ai', icon: 'fa-robot' },
  { name: 'TaskManager.app', path: '/home/user/desktop/taskmgr.app', type: FileType.APP, content: 'taskmgr', icon: 'fa-chart-line' },
  { name: 'Maps.app', path: '/home/user/desktop/maps.app', type: FileType.APP, content: 'maps', icon: 'fa-map-marked-alt' },
  { name: 'Calculator.app', path: '/home/user/desktop/calc.app', type: FileType.APP, content: 'calc', icon: 'fa-calculator' },
  { name: 'Media.app', path: '/home/user/desktop/media.app', type: FileType.APP, content: 'media', icon: 'fa-compact-disc' },
  { name: 'Weather.app', path: '/home/user/desktop/weather.app', type: FileType.APP, content: 'weather', icon: 'fa-cloud-sun' },
  { name: 'Clock.app', path: '/home/user/desktop/clock.app', type: FileType.APP, content: 'clock', icon: 'fa-clock' },
  { name: 'Notes.app', path: '/home/user/desktop/notes.app', type: FileType.APP, content: 'notes', icon: 'fa-sticky-note' },
  { name: 'Gallery.app', path: '/home/user/desktop/gallery.app', type: FileType.APP, content: 'gallery', icon: 'fa-images' },
  { name: 'SysInfo.app', path: '/home/user/desktop/sysinfo.app', type: FileType.APP, content: 'sysinfo', icon: 'fa-info-circle' },
];

export const APP_Z_START = 100;
export const TASKBAR_HEIGHT = 56;
export const DEFAULT_WALLPAPER = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920';

export const WALLPAPERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1511497584788-876760111969',
  'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
  'https://images.unsplash.com/photo-1444464666168-49d633b867ad',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809'
].map(url => `${url}?auto=format&fit=crop&q=80&w=1920`);

export const ACCENT_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4'];

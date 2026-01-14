import { FileType, VFile } from './types';

export const SYSTEM_FILES: VFile[] = [
  { name: 'kernel.sys', path: '/sys/boot/kernel.sys', type: FileType.SYSTEM, isCritical: true, content: 'SYSTEM_CORE_0xFF1A' },
  { name: 'shell.exe', path: '/sys/bin/shell.exe', type: FileType.SYSTEM, isCritical: true, content: 'UI_SHELL_MODULE' },
  { name: 'icons.dll', path: '/sys/ui/icons.dll', type: FileType.SYSTEM, isCritical: true, content: 'GLYPH_RESOURCE_PACK' },
  { name: 'menu.srv', path: '/sys/ui/menu.srv', type: FileType.SYSTEM, isCritical: true, content: 'CONTEXT_MENU_HANDLER' },
  { name: 'fstab', path: '/etc/fstab', type: FileType.SYSTEM, isCritical: true, content: 'UUID=root / ext4 defaults 1 1' },
  { name: 'hosts', path: '/etc/hosts', type: FileType.SYSTEM, isCritical: false, content: '127.0.0.1 localhost' },
  { name: 'syslog', path: '/var/log/syslog', type: FileType.SYSTEM, isCritical: false, content: '[INFO] System boot successful.' },
  { name: 'display.drv', path: '/sys/drivers/display.drv', type: FileType.SYSTEM, isCritical: true, content: 'DRV_DISPLAY_V1' },
  { name: 'input.drv', path: '/sys/drivers/input.drv', type: FileType.SYSTEM, isCritical: true, content: 'DRV_INPUT_HID' },
  
  // Desktop Directory
  { name: 'desktop', path: '/home/user/desktop', type: FileType.DIRECTORY },
  
  // Desktop Apps (Pointer Files)
  { name: 'Terminal.app', path: '/home/user/desktop/terminal.app', type: FileType.APP, content: 'terminal', icon: 'fa-terminal' },
  { name: 'Files.app', path: '/home/user/desktop/explorer.app', type: FileType.APP, content: 'explorer', icon: 'fa-folder' },
  { name: 'Settings.app', path: '/home/user/desktop/settings.app', type: FileType.APP, content: 'settings', icon: 'fa-cog' },
  { name: 'Store.app', path: '/home/user/desktop/store.app', type: FileType.APP, content: 'store', icon: 'fa-shopping-bag' },
  { name: 'Editor.app', path: '/home/user/desktop/editor.app', type: FileType.APP, content: 'editor', icon: 'fa-file-lines' },
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
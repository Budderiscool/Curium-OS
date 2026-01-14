import { FileType, VFile } from './types';

export const SYSTEM_FILES: VFile[] = [
  { name: 'kernel.sys', path: '/sys/boot/kernel.sys', type: FileType.SYSTEM, isCritical: true, content: 'SYSTEM_CORE_0xFF1A' },
  { name: 'shell.exe', path: '/sys/bin/shell.exe', type: FileType.SYSTEM, isCritical: true, content: 'UI_SHELL_MODULE' },
  { name: 'icons.dll', path: '/sys/ui/icons.dll', type: FileType.SYSTEM, isCritical: true, content: 'GLYPH_RESOURCE_PACK' },
  { name: 'menu.srv', path: '/sys/ui/menu.srv', type: FileType.SYSTEM, isCritical: true, content: 'CONTEXT_MENU_HANDLER' },
  
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
export const ACCENT_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];
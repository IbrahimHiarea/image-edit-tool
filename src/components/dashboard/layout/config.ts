import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  // * Side bar items
  { key: 'categories', title: 'Categories', href: paths.dashboard.categories, icon: 'categories' },
  { key: 'images', title: 'Images', href: paths.dashboard.images, icon: 'images' },
  { key: 'annotations', title: 'Annotations', href: paths.dashboard.annotations, icon: 'annotations' },
] satisfies NavItemConfig[];

import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { Images as ImagesIcon } from '@phosphor-icons/react/dist/ssr/Images';
import { NotePencil as NotePencilIcon } from '@phosphor-icons/react/dist/ssr/NotePencil';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { SquaresFour as SquaresFourIcon } from '@phosphor-icons/react/dist/ssr/SquaresFour';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  // * Side bar icons
  categories: SquaresFourIcon,
  images: ImagesIcon,
  annotations: NotePencilIcon,

  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;

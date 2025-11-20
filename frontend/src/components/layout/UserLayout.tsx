import type { ReactNode } from 'react';
import Sidebar from '../ui/Sidebar';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return <Sidebar>{children}</Sidebar>;
}

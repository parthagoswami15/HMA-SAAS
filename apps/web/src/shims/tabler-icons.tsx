// Non-destructive shim for @tabler/icons-react missing icons across versions
// Re-export everything that exists, and provide safe fallbacks for missing ones.
import * as RealIcons from '@tabler/icons-react';
import React from 'react';

export * from '@tabler/icons-react';

type GenericIconProps = React.SVGProps<SVGSVGElement> & { size?: number | string };

function PlaceholderIcon(props: GenericIconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export const IconScalpel = (RealIcons as any).IconScalpel ?? PlaceholderIcon;
export const IconVial = (RealIcons as any).IconVial ?? PlaceholderIcon;
export const IconSyringe = (RealIcons as any).IconSyringe ?? PlaceholderIcon;
export const IconMoreVertical = (RealIcons as any).IconMoreVertical ?? PlaceholderIcon;
export const IconRecord = (RealIcons as any).IconRecord ?? PlaceholderIcon;
export const IconRecordOff = (RealIcons as any).IconRecordOff ?? PlaceholderIcon;
export const IconFilePdf = (RealIcons as any).IconFilePdf ?? PlaceholderIcon;
export const IconShieldAlert = (RealIcons as any).IconShieldAlert ?? PlaceholderIcon;
export const IconSortAscending = (RealIcons as any).IconSortAscending ?? PlaceholderIcon;
export const IconSortDescending = (RealIcons as any).IconSortDescending ?? PlaceholderIcon;
export const IconDashboard = (RealIcons as any).IconDashboard ?? PlaceholderIcon;
export const IconUsers = (RealIcons as any).IconUsers ?? PlaceholderIcon;
export const IconFileText = (RealIcons as any).IconFileText ?? PlaceholderIcon;
export const IconUser = (RealIcons as any).IconUser ?? PlaceholderIcon;
export const IconUserPlus = (RealIcons as any).IconUserPlus ?? PlaceholderIcon;
export const IconCalendar = (RealIcons as any).IconCalendar ?? PlaceholderIcon;
export const IconChartBar = (RealIcons as any).IconChartBar ?? PlaceholderIcon;
export const IconStethoscope = (RealIcons as any).IconStethoscope ?? PlaceholderIcon;
export const IconPill = (RealIcons as any).IconPill ?? PlaceholderIcon;
export const IconDatabase = (RealIcons as any).IconDatabase ?? PlaceholderIcon;
export const IconBuilding = (RealIcons as any).IconBuilding ?? PlaceholderIcon;
export const IconCurrencyDollar = (RealIcons as any).IconCurrencyDollar ?? PlaceholderIcon;
export const IconShield = (RealIcons as any).IconShield ?? PlaceholderIcon;
export const IconSettings = (RealIcons as any).IconSettings ?? PlaceholderIcon;
export const IconMessage = (RealIcons as any).IconMessage ?? PlaceholderIcon;
export const IconBell = (RealIcons as any).IconBell ?? PlaceholderIcon;
export const IconRobot = (RealIcons as any).IconRobot ?? PlaceholderIcon;
export const IconVideo = (RealIcons as any).IconVideo ?? PlaceholderIcon;
export const IconLogout = (RealIcons as any).IconLogout ?? PlaceholderIcon;
export const IconChevronDown = (RealIcons as any).IconChevronDown ?? PlaceholderIcon;
export const IconBed = (RealIcons as any).IconBed ?? PlaceholderIcon;
export const IconHeartbeat = (RealIcons as any).IconHeartbeat ?? PlaceholderIcon;
export const IconScan = (RealIcons as any).IconScan ?? PlaceholderIcon;



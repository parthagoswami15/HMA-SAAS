# HMS SAAS - Responsive Design Guide

## Overview
This document outlines the responsive design patterns implemented across the HMS SAAS application to ensure optimal user experience on all devices (mobile, tablet, and desktop).

## Breakpoints
The application uses Tailwind CSS breakpoints:
- **Mobile**: < 640px (base)
- **Small (sm)**: ≥ 640px
- **Medium (md)**: ≥ 768px
- **Large (lg)**: ≥ 1024px
- **Extra Large (xl)**: ≥ 1280px
- **2XL**: ≥ 1536px

## Key Responsive Components

### 1. Layout Component (`/src/app/components/Layout.tsx`)
**Mobile Features:**
- Hamburger menu button for mobile devices
- Full-screen overlay sidebar on mobile
- Collapsible sidebar on desktop
- Responsive header with adaptive text sizing
- Mobile-optimized navigation

**Usage:**
```tsx
<Layout>
  {/* Your page content */}
</Layout>
```

### 2. ResponsiveTable Component (`/src/components/ui/ResponsiveTable.tsx`)
**Features:**
- Horizontal scroll on mobile devices
- Full-width display on larger screens
- Prevents table overflow

**Usage:**
```tsx
import ResponsiveTable from '@/components/ui/ResponsiveTable';

<ResponsiveTable>
  <Table>
    {/* Table content */}
  </Table>
</ResponsiveTable>
```

### 3. ResponsiveGrid Component (`/src/components/ui/ResponsiveGrid.tsx`)
**Features:**
- Customizable column counts per breakpoint
- Flexible gap spacing
- Auto-responsive layout

**Usage:**
```tsx
import ResponsiveGrid from '@/components/ui/ResponsiveGrid';

<ResponsiveGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} gap="gap-4">
  {/* Grid items */}
</ResponsiveGrid>
```

### 4. ResponsiveModal Component (`/src/components/ui/ResponsiveModal.tsx`)
**Features:**
- Adapts to viewport height (max-h-[90vh])
- Responsive padding and text sizing
- Scroll support for long content

**Usage:**
```tsx
import ResponsiveModal from '@/components/ui/ResponsiveModal';

<ResponsiveModal
  opened={opened}
  onClose={close}
  title="Modal Title"
  size="lg"
>
  {/* Modal content */}
</ResponsiveModal>
```

## Responsive Design Patterns

### Text Sizing
Use responsive text classes:
```tsx
className="text-sm sm:text-base md:text-lg lg:text-xl"
```

### Spacing (Padding & Margin)
Use responsive spacing:
```tsx
className="p-3 sm:p-4 md:p-6 lg:p-8"
className="mb-4 sm:mb-6 md:mb-8"
```

### Grid Layouts
Use responsive grid columns:
```tsx
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
```

### Flex Layouts
Use responsive flex direction:
```tsx
className="flex flex-col sm:flex-row"
```

### Visibility Control
Hide/show elements based on screen size:
```tsx
className="hidden sm:block"  // Hidden on mobile, visible on sm+
className="block sm:hidden"  // Visible on mobile, hidden on sm+
className="lg:hidden"        // Hidden on large screens
```

### Tables
Always wrap tables in ResponsiveTable or use overflow-x-auto:
```tsx
<div className="overflow-x-auto">
  <Table>
    {/* Table content */}
  </Table>
</div>
```

### Cards and Containers
Use full-width on mobile, constrained on desktop:
```tsx
className="w-full max-w-full lg:max-w-4xl"
```

### Buttons and Actions
Stack buttons on mobile, inline on desktop:
```tsx
<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```

## Page-Specific Implementations

### Dashboard Page
- **Stats Cards**: 1 column (mobile) → 2 columns (sm) → 4 columns (lg)
- **Module Grid**: 1 column (mobile) → 2 columns (sm) → 3 columns (lg) → 4 columns (xl)
- **Welcome Section**: Responsive padding and text sizing

### Users Page
- **Table**: Horizontal scroll wrapper for mobile
- **Filters**: Stack on mobile, inline on desktop
- **Stats Cards**: Responsive grid (1→2→5 columns)

### Forms
- **Input Fields**: Full-width on mobile, constrained on desktop
- **Form Layouts**: Single column on mobile, multi-column on desktop
- **Submit Buttons**: Full-width on mobile, auto-width on desktop

## Best Practices

### 1. Mobile-First Approach
Start with mobile styles, then add larger breakpoint styles:
```tsx
className="text-sm md:text-base lg:text-lg"  // ✅ Good
className="lg:text-lg md:text-base text-sm"  // ❌ Avoid
```

### 2. Touch-Friendly Targets
Ensure interactive elements are at least 44x44px on mobile:
```tsx
className="p-3 sm:p-2"  // Larger padding on mobile
```

### 3. Readable Text
Maintain readable font sizes on all devices:
```tsx
className="text-sm sm:text-base"  // Minimum 14px on mobile
```

### 4. Avoid Horizontal Scroll
Use `overflow-x-auto` for tables and wide content:
```tsx
<div className="overflow-x-auto">
  {/* Wide content */}
</div>
```

### 5. Test on Real Devices
Test at these breakpoints:
- 360px (small mobile)
- 768px (tablet)
- 1024px (desktop)
- 1440px (large desktop)

## Common Issues and Solutions

### Issue: Table overflows on mobile
**Solution**: Wrap in ResponsiveTable or add overflow-x-auto

### Issue: Text too small on mobile
**Solution**: Use responsive text classes (text-sm sm:text-base)

### Issue: Buttons too close together on mobile
**Solution**: Use flex-col on mobile (flex flex-col sm:flex-row gap-2)

### Issue: Modal content cut off on mobile
**Solution**: Use ResponsiveModal with max-h-[90vh] and overflow-y-auto

### Issue: Grid columns too narrow on mobile
**Solution**: Use grid-cols-1 for mobile, increase on larger screens

## Viewport Meta Tag
Already configured in `/src/app/layout.tsx`:
```tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#667eea',
};
```

## Testing Checklist
- [ ] Test on mobile (360px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1024px width)
- [ ] Test on large desktop (1440px width)
- [ ] Verify all tables scroll horizontally on mobile
- [ ] Verify all modals fit within viewport
- [ ] Verify navigation menu works on mobile
- [ ] Verify touch targets are large enough
- [ ] Verify text is readable on all devices
- [ ] Verify images scale properly

## Resources
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Mantine Responsive Styles](https://mantine.dev/styles/responsive/)
- [Web.dev Mobile UX](https://web.dev/mobile-ux/)

# HMS SAAS - Responsive Design Quick Reference

## 🎯 Quick Patterns

### Text Sizing
```tsx
className="text-sm sm:text-base md:text-lg lg:text-xl"
```

### Spacing
```tsx
className="p-3 sm:p-4 md:p-6 lg:p-8"
className="mb-4 sm:mb-6 md:mb-8"
className="gap-2 sm:gap-3 md:gap-4"
```

### Grid Layouts
```tsx
// Stats Cards
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"

// Module Cards
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"

// Form Fields
className="grid grid-cols-1 md:grid-cols-2 gap-4"
```

### Flex Layouts
```tsx
// Stack on mobile, inline on desktop
className="flex flex-col sm:flex-row gap-2"

// Reverse on mobile
className="flex flex-col-reverse sm:flex-row"
```

### Tables
```tsx
import ResponsiveTable from '@/components/ui/ResponsiveTable';

<ResponsiveTable>
  <Table>{/* content */}</Table>
</ResponsiveTable>

// Or manually:
<div className="overflow-x-auto">
  <Table>{/* content */}</Table>
</div>
```

### Modals
```tsx
import ResponsiveModal from '@/components/ui/ResponsiveModal';

<ResponsiveModal opened={opened} onClose={close} title="Title">
  {/* content */}
</ResponsiveModal>
```

### Visibility
```tsx
className="hidden sm:block"      // Hide on mobile
className="block sm:hidden"      // Show only on mobile
className="hidden lg:block"      // Show only on large screens
className="lg:hidden"            // Hide on large screens
```

### Buttons
```tsx
// Full width on mobile
className="w-full sm:w-auto"

// Stack on mobile
<div className="flex flex-col sm:flex-row gap-2">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```

### Images
```tsx
className="w-full h-auto"
className="max-w-full"
```

### Containers
```tsx
className="w-full max-w-full lg:max-w-4xl"
className="container mx-auto px-4 sm:px-6 lg:px-8"
```

## 📱 Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| base | 0px | Mobile-first (default) |
| sm | 640px | Small tablets |
| md | 768px | Tablets |
| lg | 1024px | Desktops |
| xl | 1280px | Large desktops |
| 2xl | 1536px | Extra large screens |

## 🛠️ Utility Components

### ResponsiveTable
```tsx
<ResponsiveTable>
  <Table>{/* content */}</Table>
</ResponsiveTable>
```

### ResponsiveGrid
```tsx
<ResponsiveGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
  {/* items */}
</ResponsiveGrid>
```

### ResponsiveModal
```tsx
<ResponsiveModal opened={opened} onClose={close}>
  {/* content */}
</ResponsiveModal>
```

## ✅ Checklist

- [ ] Text readable (min 14px on mobile)
- [ ] Touch targets ≥ 44x44px
- [ ] Tables scroll horizontally
- [ ] Modals fit viewport (max-h-[90vh])
- [ ] No horizontal page scroll
- [ ] Images scale properly
- [ ] Forms stack on mobile
- [ ] Navigation works on mobile
- [ ] Buttons are accessible
- [ ] Spacing is adequate

## 🚀 Common Fixes

### Fix: Table overflow
```tsx
<div className="overflow-x-auto">
  <Table>{/* content */}</Table>
</div>
```

### Fix: Text too small
```tsx
className="text-sm sm:text-base"
```

### Fix: Buttons too close
```tsx
className="flex flex-col sm:flex-row gap-2"
```

### Fix: Modal cut off
```tsx
className="max-h-[90vh] overflow-y-auto"
```

### Fix: Grid too narrow
```tsx
className="grid-cols-1 sm:grid-cols-2"
```

## 📖 Full Documentation
See `RESPONSIVE_DESIGN_GUIDE.md` for complete guide.

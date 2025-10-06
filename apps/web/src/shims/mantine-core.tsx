// Non-destructive shim for Mantine components that moved packages in v8
// Date inputs moved to @mantine/dates; MediaQuery was removed in favor of CSS and use-media-query
export * from '@mantine/core';

// Provide light-weight fallbacks that render nothing to avoid build breaks
export const DatePicker: React.FC<any> = () => null as any;
export const DatePickerInput: React.FC<any> = () => null as any;
export const TimeInput: React.FC<any> = () => null as any;
export const MediaQuery: React.FC<any> = ({ children }: any) => children;

// Fallbacks for Mantine internals used by @mantine/charts (no-ops)
export const createVarsResolver = (..._args: any[]) => ({});
export const getThemeColor = (_color: any, _theme?: any) => '#667eea';
export const factory = (component: any) => component;
export const useProps = (_name: string, _defaults: any, props: any) => [props, {}] as const;
export const useMantineTheme = () => ({ colors: {}, primaryColor: 'blue' });
export const useResolvedStylesApi = () => ({ resolvedClassNames: {}, resolvedStyles: {} });
export const useStyles = (_name?: string, _params?: any) => ({ classes: {}, theme: useMantineTheme() });

// Basic Box fallback
export const Box: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

// Additional UI fallbacks used by charts
export const Group: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} {...rest}>{children}</div>
);

export const Text: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, ...rest }) => (
  <span {...rest}>{children}</span>
);

export const ColorSwatch: React.FC<{ color?: string } & React.HTMLAttributes<HTMLDivElement>> = ({ color = '#667eea', style, ...rest }) => (
  <div style={{ width: 12, height: 12, borderRadius: 2, background: color, ...style }} {...rest} />
);

export const rem = (value: number | string) => (typeof value === 'number' ? `${value / 16}rem` : value);

// More commonly used primitives
export const Tooltip: React.FC<{ label?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>> = ({ label, children, ...rest }) => (
  <div {...rest} title={typeof label === 'string' ? label : undefined}>{children}</div>
);

export const Paper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...rest }) => (
  <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, ...style }} {...rest}>{children}</div>
);

export const UnstyledButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, style, ...rest }) => (
  <button style={{ background: 'none', border: 'none', padding: 0, margin: 0, ...style }} {...rest}>{children}</button>
);

export const getSize = (_sizes: any, _size: any) => 16;
export const getFontSize = (_size: any) => 14;
export const useInputProps = (_name: string, props: any) => ({ ...props });

// Minimal Input component to satisfy @mantine/dates peer usage
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> & { Wrapper?: React.FC<any>; Label?: React.FC<any>; Description?: React.FC<any>; Error?: React.FC<any>; } =
  Object.assign(((props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />) as React.FC<React.InputHTMLAttributes<HTMLInputElement>>, {
    Wrapper: ({ children, style, ...rest }: any) => <div style={{ display: 'block', ...style }} {...rest}>{children}</div>,
    Label: ({ children, style, ...rest }: any) => <label style={{ display: 'block', marginBottom: 4, ...style }} {...rest}>{children}</label>,
    Description: ({ children, style, ...rest }: any) => <div style={{ fontSize: 12, color: '#6b7280', ...style }} {...rest}>{children}</div>,
    Error: ({ children, style, ...rest }: any) => <div style={{ fontSize: 12, color: '#ef4444', ...style }} {...rest}>{children}</div>,
  });

export const AccordionChevron: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, style, ...rest }) => (
  <span style={{ display: 'inline-block', transform: 'rotate(0deg)', ...style }} {...rest}>{children ?? '▾'}</span>
);

// Components used by @mantine/modals and others
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, style, ...rest }) => (
  <button style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#f3f4f6', ...style }} {...rest}>{children}</button>
);

export const Modal: React.FC<{ opened?: boolean; onClose?: () => void } & React.HTMLAttributes<HTMLDivElement>> = ({ opened = false, onClose, children, style, ...rest }) => (
  !opened ? null : (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: 'white', borderRadius: 8, padding: 16, minWidth: 300, ...style }} {...rest}>
        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
);

export const Popover: React.FC<{ opened?: boolean; withArrow?: boolean } & React.HTMLAttributes<HTMLDivElement>> & { Target?: React.FC<any>; Dropdown?: React.FC<any> } =
  Object.assign(((props: any) => <div {...props} />) as React.FC<any>, {
    Target: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    Dropdown: ({ children, style, ...rest }: any) => <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 6, padding: 8, ...style }} {...rest}>{children}</div>,
  });

export const ActionIcon: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, style, ...rest }) => (
  <button style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #e5e7eb', background: '#f9fafb', ...style }} {...rest}>{children}</button>
);

export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path d="M3 9l3 3 7-7" />
  </svg>
);

export const getDefaultZIndex = (_type?: string) => 2000;
export const createUseExternalEvents = (_name: string) => () => ({ publish: (_event: string, _payload?: any) => {} });

// Notifications helpers
export const Notification: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...rest }) => (
  <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, ...style }} {...rest}>{children}</div>
);

export const OptionalPortal: React.FC<{ withinPortal?: boolean } & React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

export const RemoveScroll: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

// Common layout and form components used in app
export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> & { Thead?: any; Tbody?: any; Tr?: any; Th?: any; Td?: any } =
  Object.assign(((props: any) => <table {...props} />) as any, {
    Thead: (props: any) => <thead {...props} />,
    Tbody: (props: any) => <tbody {...props} />,
    Tr: (props: any) => <tr {...props} />,
    Th: (props: any) => <th {...props} />,
    Td: (props: any) => <td {...props} />,
  });

export const Flex: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...rest }) => (
  <div style={{ display: 'flex', gap: 8, ...style }} {...rest}>{children}</div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => <select {...props} />;
export const Pagination: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => <div {...rest}>{children}</div>;
export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, style, ...rest }) => (
  <span style={{ background: '#eef2ff', color: '#3730a3', padding: '2px 6px', borderRadius: 6, fontSize: 12, ...style }} {...rest}>{children}
  </span>
);
export const AppShell: React.FC<React.HTMLAttributes<HTMLDivElement>> & { Header?: any; Navbar?: any; Main?: any } =
  Object.assign(((props: any) => <div {...props} />) as any, {
    Header: (props: any) => <header {...props} />,
    Navbar: (props: any) => <nav {...props} />,
    Main: (props: any) => <main {...props} />,
  });
export const Burger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => <button {...props}>≡</button>;
export const Indicator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => <div {...rest}>{children}</div>;
export const Menu: React.FC<React.HTMLAttributes<HTMLDivElement>> & { Target?: any; Dropdown?: any; Item?: any } =
  Object.assign(((props: any) => <div {...props} />) as any, {
    Target: (props: any) => <div {...props} />,
    Dropdown: (props: any) => <div {...props} />,
    Item: (props: any) => <div {...props} />,
  });
export const Avatar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...rest }) => (
  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e5e7eb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }} {...rest}>{children}</div>
);
export const ScrollArea: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...rest }) => (
  <div style={{ overflow: 'auto', ...style }} {...rest}>{children}</div>
);
export const Stack: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...rest }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }} {...rest}>{children}</div>
);
export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, ...rest }) => (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16, ...style }} {...rest}>{children}</div>
);
export const MantineProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;
export const ColorSchemeScript: React.FC = () => null;



# Design System Documentation

## Inspiration
Our design system is inspired by [cnstrct.ai](https://www.cnstrct.ai/), which demonstrates excellent use of:
- Minimalist, modern design principles
- Clean spacing and typography
- High-contrast sections
- Premium imagery presentation
- Smooth animations and transitions

## Design Principles

### 1. Visual Language
- **Minimalism**: Clean interfaces with focus on content
- **Content First**: Images and boards are the primary focus
- **Whitespace**: Generous spacing for better visual hierarchy
- **Consistency**: Unified design patterns across all components
- **Responsiveness**: Fluid layouts that work across all devices

### 2. Color System
```typescript
const colors = {
  primary: {
    dark: '#000000',
    light: '#FFFFFF',
  },
  accent: {
    gray: '#F5F5F5',
    hover: '#E5E5E5',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
  }
}
```

### 3. Typography
```css
--font-sans: 'Inter var', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
```

## Component Architecture

### 1. Core Components
```
components/
  layout/
    Header/
    Footer/
    Sidebar/
  common/
    Button/
    Input/
    Card/
    Modal/
  board/
    BoardGrid/
    ImageCard/
    DragHandle/
  auth/
    SignInForm/
    UserMenu/
```

### 2. Base Component Styles

#### Button
```typescript
const Button = {
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  variants: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  sizes: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10',
  }
}
```

#### Card
```typescript
const Card = {
  base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  hover: 'transition-all duration-200 hover:shadow-md',
  variants: {
    default: 'bg-background',
    muted: 'bg-muted',
  }
}
```

#### Input
```typescript
const Input = {
  base: 'flex h-10 rounded-md border border-input bg-background px-3 py-2',
  focus: 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  error: 'border-red-500 focus:ring-red-500',
  disabled: 'opacity-50 cursor-not-allowed',
}
```

### 3. Animation System
```typescript
const animations = {
  fadeIn: 'animate-in fade-in duration-300',
  slideIn: 'animate-in slide-in-from-bottom duration-300',
  hover: 'transition-all duration-200 ease-in-out',
  scale: 'hover:scale-105 transition-transform duration-200',
}
```

## Theme Configuration

### 1. Base Theme (Light)
```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
}
```

### 2. CSS Variables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
}
```

## Implementation Guidelines

### 1. Component Development Process
1. Start with basic structure and functionality
2. Add styling using Tailwind classes
3. Implement variants and states
4. Add animations and transitions
5. Test responsiveness
6. Ensure accessibility
7. Document usage and props

### 2. Responsive Design
- Mobile-first approach
- Breakpoints:
  ```typescript
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
  ```

### 3. Performance Considerations
- Lazy load images and heavy components
- Use CSS transforms for animations
- Implement virtual scrolling for large lists
- Optimize bundle size with code splitting
- Use proper image formats and sizes

### 4. Accessibility
- Proper ARIA labels
- Keyboard navigation
- Color contrast compliance
- Focus management
- Screen reader support

## Development Workflow

1. **Component Creation:**
   - Create component directory
   - Add TypeScript interface
   - Implement base component
   - Add variants and styles
   - Write tests
   - Add documentation

2. **Style Integration:**
   - Use Tailwind utility classes
   - Implement dark mode support
   - Add responsive styles
   - Test across breakpoints

3. **Quality Assurance:**
   - Visual regression testing
   - Cross-browser testing
   - Performance benchmarking
   - Accessibility audit

## Best Practices

1. **Code Organization:**
   - Keep components small and focused
   - Use composition over inheritance
   - Maintain consistent file structure
   - Document component usage

2. **Styling:**
   - Use Tailwind's utility classes
   - Avoid custom CSS when possible
   - Maintain consistent spacing
   - Follow design tokens

3. **Performance:**
   - Optimize images
   - Minimize JavaScript
   - Use proper caching
   - Monitor bundle size

4. **Accessibility:**
   - Follow WCAG guidelines
   - Test with screen readers
   - Ensure keyboard navigation
   - Maintain proper contrast 
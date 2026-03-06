
## Task 1.2: Configure Tailwind CSS + shadcn/ui with Gold Theme

### Components Installed
1. **Button** - Primary CTA with gold background
2. **Card** - Content containers with proper padding
3. **Input** - Form text inputs with validation states
4. **Select** - Dropdown selection with Radix UI primitives
5. **Dialog** - Modal dialogs for confirmations
6. **DropdownMenu** - Theme toggle menu

### Theme Configuration

#### Gold Color Palette
```css
--gold-50:  #FFF9E5  /* Lightest cream */
--gold-100: #FFF3CC  /* Pale yellow */
--gold-200: #FFE799  /* Light yellow */
--gold-300: #FFDB66  /* Soft yellow */
--gold-400: #FFCF33  /* Yellow gold */
--gold-500: #FFD700  /* Bright gold (Primary) */
--gold-600: #CCAC00  /* Goldenrod */
--gold-700: #998100  /* Dark gold */
--gold-800: #665600  /* Dark olive */
--gold-900: #332B00  /* Deepest brown-gold */
```

#### CSS Variables (HSL Format)
```css
/* Light Mode */
--primary: 51 100% 50%        /* Gold #FFD700 */
--accent: 217 91% 60%         /* Blue #3b82f6 */
--background: 0 0% 100%       /* White */
--foreground: 0 0% 10%        /* Near black */

/* Dark Mode */
--background: 0 0% 10%        /* Dark #1a1a1a */
--foreground: 0 0% 95%        /* Light gray */
--primary: 51 100% 50%        /* Gold (same in both modes) */
```

### shadcn/ui Setup Pattern

#### Manual Installation (Preferred)
Instead of using `npx shadcn@latest init` which can overwrite configs:
1. Create `components.json` manually
2. Install dependencies individually:
   - `class-variance-authority` (component variants)
   - `clsx` + `tailwind-merge` (className merging)
   - `@radix-ui/react-*` primitives (Select, Dialog, DropdownMenu)
   - `lucide-react` (icons)
3. Create `src/lib/utils.ts` with `cn()` helper
4. Copy component source from shadcn/ui registry

#### Component Structure
```
src/
├── components/
│   ├── ui/           # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   └── dropdown-menu.tsx
│   ├── theme-provider.tsx
│   └── mode-toggle.tsx
└── lib/
    └── utils.ts      # cn() helper
```

### Dark Mode Implementation

#### next-themes Setup
```typescript
// layout.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

#### Mode Toggle Component
- Sun/Moon icons from lucide-react
- Dropdown menu with Light/Dark/System options
- Uses `useTheme()` hook from next-themes

### Key Dependencies
```json
{
  "dependencies": {
    "next-themes": "^0.2.1",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

### Verification
- [x] shadcn/ui initialized with components.json
- [x] 5 base components installed (Button, Card, Input, Select, Dialog)
- [x] Gold theme configured in tailwind.config.ts
- [x] Dark mode toggle works (tested with Playwright)
- [x] Test page shows styled components
- [x] Evidence: Screenshots captured (light + dark mode)

### Evidence Location
```
.sisyphus/evidence/task-1-2/
├── components-light.png   # Light mode verification
└── components-dark.png    # Dark mode verification
```

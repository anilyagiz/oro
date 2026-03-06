# OroRound Project Learnings

## Task 1.1: Next.js 14 Project Initialization

### Setup Approach
- Manual project creation preferred over `create-next-app` for better control
- Installed Next.js 14.2.35 with React 18
- Configured TypeScript with strict mode
- Set up Tailwind CSS for styling

### Key Configuration Files

#### tsconfig.json
- `strict: true` - Enabled strict TypeScript mode
- `paths: { "@/*": ["./src/*"] }` - Configured path aliases
- `baseUrl: "."` - Set base URL for path resolution

#### next.config.js
- Basic configuration with `reactStrictMode: true`

#### tailwind.config.js
- Content paths configured for src directory structure
- Standard Tailwind setup

### Dependencies

#### Production
- next@14.2.35
- react@18.3.1
- react-dom@18.3.1

#### Development
- typescript@5.9.3
- @types/node, @types/react, @types/react-dom
- tailwindcss@4.2.0
- postcss@8.5.6
- eslint@8.57.1 (v8 for compatibility with Next.js 14)
- eslint-config-next@14.2.35
- autoprefixer

### Lessons Learned
1. ESLint v9 has breaking changes and is not compatible with Next.js 14's eslint-config-next
   - Solution: Use ESLint v8.57.1 for Next.js 14 projects

2. Path aliases require both tsconfig.json and next.config.js configuration
   - TypeScript needs `paths` and `baseUrl`
   - Next.js automatically picks up tsconfig paths

3. Manual setup allows better dependency version control
   - Avoids unexpected version conflicts
   - Cleaner understanding of project structure

### Project Structure
```
src/
└── app/
    ├── layout.tsx    # Root layout with Inter font
    ├── page.tsx      # Home page
    └── globals.css   # Tailwind directives
```

### Verification Commands
```bash
# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Build
npm run build

# Lint
npm run lint
```

### Success Criteria
- [x] Dev server starts on localhost:3000
- [x] HTTP 200 response verified
- [x] TypeScript strict mode active
- [x] Path aliases working (@/*)
- [x] Tailwind CSS integrated
- [x] Git repository initialized

## Task 3.1: AmountInput Component

### Component Features
- Number input with USDC label positioned at left
- Real-time validation with min ($0.01), max ($10,000), and precision (2 decimals) constraints
- Clear button (X) appears when value exists and input is not disabled
- Helper text showing valid range: "Min: $0.01, Max: $10,000"
- Accessible with proper ARIA labels, describedby, and error announcements

### Implementation Patterns

#### Validation Strategy
```typescript
// Separate validation function returning structured state
type ValidationError = 'min' | 'max' | 'precision' | null;
interface ValidationState {
  isValid: boolean;
  error: ValidationError;
  errorMessage: string;
}
```

#### Input Formatting
- Remove non-numeric characters except decimal point
- Prevent multiple decimal points
- Strip leading zeros (except "0.x" format)
- Limit decimal places to 2

#### ARIA Accessibility
- `aria-label`: "Amount in USDC" (or custom)
- `aria-invalid`: true when validation fails
- `aria-describedby`: Points to error message and helper text IDs
- Error messages use `role="alert"` for screen reader announcements

#### Styling Approach
- Uses shadcn/ui Input component as base
- Tailwind classes for positioning and visual states
- Error state: `border-destructive` with red focus ring
- Focus state: `border-primary` (yellow/gold theme)
- Animation: `animate-in fade-in slide-in-from-top-1` for errors

### Build Issues Encountered

#### Issue 1: Tailwind Config Conflict
**Problem**: `tailwind.config.js` (empty config) was overriding `tailwind.config.ts` (full config)
**Solution**: Removed `tailwind.config.js`, keeping only the TypeScript config

#### Issue 2: CSS border-border Class
**Problem**: `border-border` class not recognized in @layer base
**Solution**: Changed from `@apply border-border` to direct CSS `border-color: hsl(var(--border))`

### Exports
```typescript
// Component and constants
export { AmountInput, MIN_AMOUNT, MAX_AMOUNT, DECIMAL_PLACES };

// Types
export type { ValidationState, ValidationError };
export interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (isValid: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

### Dependencies
- `lucide-react` for X icon (clear button)
- `@/components/ui/input` (shadcn Input)
- `@/components/ui/button` (shadcn Button)
- `@/lib/utils` (cn helper for className merging)

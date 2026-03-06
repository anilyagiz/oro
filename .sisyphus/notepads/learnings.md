# Component Development Learnings

## DevnetBanner Component
- Location: ororound/src/components/ui/DevnetBanner.tsx
- Uses "use client" directive for client-side interactivity
- Implements LocalStorage persistence for dismissed state
- Uses hydration-safe pattern (isMounted check) to prevent SSR mismatch

## Design Patterns Used
- Fixed positioning with high z-index (z-[100]) for overlay behavior
- Tailwind gradient for visual impact (amber-500 via-orange-500 to-amber-600)
- Responsive design with sm: breakpoints for mobile/desktop adaptation
- Semantic HTML with proper aria-labels for accessibility
- Backdrop blur and transparency for modern glass-morphism effect

## State Management
- LocalStorage key: 'ororound-devnet-banner-dismissed'
- Boolean string storage ('true'/'false') for simplicity
- Hydration-safe: waits for mount before checking localStorage

## Integration Notes
- Component should be placed in layout.tsx to appear on all pages
- Uses lucide-react icons (X, AlertTriangle, Radio)
- Compatible with shadcn/ui project structure

---

# ErrorBoundary Component

## Task 2.6: Wallet Crash Protection
- Location: components/ErrorBoundary.tsx
- Class component with componentDidCatch lifecycle method
- Wraps entire app in providers.tsx for global error catching

## Error Detection Features
- Detects wallet/Solana-specific errors via keyword matching:
  - Keywords: wallet, solana, phantom, solflare, metamask, web3, connection, signature, transaction, program, anchor
- Logs wallet errors separately for analytics/monitoring
- Shows contextual error messages based on error type

## Recovery UI Pattern (shadcn Alert-style)
- Destructive color scheme (red-based) for error states
- AlertCircle icon in circular badge
- "Something went wrong" title with contextual description
- Two action buttons: Reload Page (primary) and Report Issue (secondary)
- Development mode: collapsible error details with stack trace
- Additional help text for wallet-specific troubleshooting

## Styling Approach
- Uses Tailwind classes matching shadcn design system:
  - `border-destructive/50 bg-destructive/10` for alert container
  - `text-destructive` for error text
  - `bg-destructive text-destructive-foreground` for primary button
  - `border-input bg-background hover:bg-accent` for secondary button
- Responsive layout with flexbox and sm: breakpoints
- Min-height 400px for consistent error display area

## Implementation Notes
- Custom fallback prop support for custom error UIs
- Reset function for retry without full page reload
- Window existence check for SSR compatibility
- GitHub issue link for error reporting (customizable)

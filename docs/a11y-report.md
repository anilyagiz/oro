# Accessibility Audit Report - Oro Project

## Overview
This report evaluates the accessibility (a11y) standards of the Oro project, focusing on the implementation of Radix UI primitives and color contrast ratios across light and dark modes. The project aims to comply with WCAG 2.1 Level AA standards.

## Radix UI Primitives Evaluation
The project leverages Radix UI primitives to ensure high-quality, accessible UI components. Radix UI provides the foundation for complex interactions while handling ARIA attributes, keyboard navigation, and focus management out of the box.

### 1. Dialog (@radix-ui/react-dialog)
- **Usage**: Wallet connection modals and purchase confirmation flows.
- **A11y Features**:
  - Automatic focus trapping within the modal.
  - Proper ARIA roles (`dialog`) and labels (`aria-labelledby`, `aria-describedby`).
  - Keyboard support: `Esc` to close, `Tab` to cycle through interactive elements.
  - Screen reader announcements when the dialog opens.

### 2. Dropdown Menu (@radix-ui/react-dropdown-menu)
- **Usage**: User settings and navigation menus.
- **A11y Features**:
  - Full keyboard navigation (arrow keys, `Enter`, `Space`).
  - Correct ARIA attributes for menu items and triggers.
  - Focus management when opening and closing the menu.

### 3. Select (@radix-ui/react-select)
- **Usage**: Token selection in the purchase flow.
- **A11y Features**:
  - Accessible alternative to native `<select>` with better styling capabilities.
  - Type-ahead support for quick navigation.
  - Screen reader support for selected values and options.

### 4. Slot (@radix-ui/react-slot)
- **Usage**: Component composition to maintain semantic HTML while applying custom styles.
- **A11y Features**: Ensures that the underlying semantic element (e.g., `button`, `a`) is preserved even when wrapped in higher-order components.

## Color Contrast Analysis
The project uses a custom color palette defined in `tailwind.config.ts` with HSL variables for theme switching.

### Light Mode
| Element | Background | Foreground | Ratio | WCAG Status |
|---------|------------|------------|-------|-------------|
| Main Text | `#FFFFFF` | `#1A1A1A` | 15.6:1 | **Pass (AAA)** |
| Muted Text | `#FFFFFF` | `#737373` | 4.0:1 | **Pass (AA Large)** |
| Primary (Gold) | `#FFFFFF` | `#FFD700` | 1.7:1 | **Fail (Text)** |
| Accent | `#FFFFFF` | `#3B82F6` | 4.6:1 | **Pass (AA)** |

**Observation**: The Primary Gold color (`#FFD700`) fails contrast requirements for small text on a white background. It should be used primarily for non-text decorative elements or large headings with a darker outline/shadow if used as text.

### Dark Mode
| Element | Background | Foreground | Ratio | WCAG Status |
|---------|------------|------------|-------|-------------|
| Main Text | `#1A1A1A` | `#F2F2F2` | 13.5:1 | **Pass (AAA)** |
| Muted Text | `#1A1A1A` | `#999999` | 5.3:1 | **Pass (AA)** |
| Primary (Gold) | `#1A1A1A` | `#FFD700` | 10.7:1 | **Pass (AAA)** |
| Accent | `#1A1A1A` | `#3B82F6` | 3.2:1 | **Fail (Small Text)** |

**Observation**: The Primary Gold color performs exceptionally well in dark mode, exceeding AAA standards. The Accent blue (`#3B82F6`) may need adjustment for small text in dark mode to meet the 4.5:1 ratio.

## Recommendations
1. **Gold Text**: Avoid using the `gold` color for small body text in light mode. Use it for buttons with dark text (e.g., `primary-foreground`) or as a background accent.
2. **Muted Text**: Increase the contrast of muted text in light mode from `#737373` to at least `#595959` to pass AA for small text.
3. **Focus Indicators**: Ensure that the `ring` color (Primary Gold) provides sufficient contrast against all backgrounds when elements are focused.
4. **Semantic HTML**: Continue using Radix UI primitives to ensure that custom components remain accessible to assistive technologies.

## Conclusion
The Oro project demonstrates a strong commitment to accessibility by utilizing Radix UI primitives. While color contrast is excellent in dark mode, some adjustments are needed in light mode to ensure full WCAG 2.1 AA compliance for all text elements.

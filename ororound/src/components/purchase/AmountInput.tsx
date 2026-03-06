'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

const MIN_AMOUNT = 0.01;
const MAX_AMOUNT = 10000;
const DECIMAL_PLACES = 2;

type ValidationError = 'min' | 'max' | 'precision' | null;

interface ValidationState {
  isValid: boolean;
  error: ValidationError;
  errorMessage: string;
}

function validateAmount(value: string): ValidationState {
  if (!value || value === '') {
    return { isValid: true, error: null, errorMessage: '' };
  }

  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return { isValid: false, error: null, errorMessage: 'Invalid amount' };
  }

  if (numValue < MIN_AMOUNT) {
    return {
      isValid: false,
      error: 'min',
      errorMessage: `Minimum amount is $${MIN_AMOUNT.toFixed(DECIMAL_PLACES)}`,
    };
  }

  if (numValue > MAX_AMOUNT) {
    return {
      isValid: false,
      error: 'max',
      errorMessage: `Maximum amount is $${MAX_AMOUNT.toLocaleString()}`,
    };
  }

  const decimalMatch = value.match(/\.(\d+)/);
  if (decimalMatch && decimalMatch[1].length > DECIMAL_PLACES) {
    return {
      isValid: false,
      error: 'precision',
      errorMessage: `Maximum ${DECIMAL_PLACES} decimal places`,
    };
  }

  return { isValid: true, error: null, errorMessage: '' };
}

function formatInputValue(value: string): string {
  if (!value) return '';

  let cleaned = value.replace(/[^\d.]/g, '');

  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }

  if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0.')) {
    cleaned = cleaned.replace(/^0+/, '');
  }

  if (parts[1] && parts[1].length > DECIMAL_PLACES) {
    cleaned = parts[0] + '.' + parts[1].slice(0, DECIMAL_PLACES);
  }

  return cleaned;
}

const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      value,
      onChange,
      onValidate,
      disabled,
      className,
      id,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
    },
    ref
  ) => {
    const [validation, setValidation] = React.useState<ValidationState>({
      isValid: true,
      error: null,
      errorMessage: '',
    });
    const [isFocused, setIsFocused] = React.useState(false);

    const generatedInputId = React.useId();
    const inputId = id ?? generatedInputId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    React.useEffect(() => {
      const newValidation = validateAmount(value);
      setValidation(newValidation);
      onValidate?.(newValidation.isValid);
    }, [value, onValidate]);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formattedValue = formatInputValue(rawValue);
        onChange(formattedValue);
      },
      [onChange]
    );

    const handleClear = React.useCallback(() => {
      onChange('');
    }, [onChange]);

    const showError = !validation.isValid && value !== '';
    const showClearButton = value !== '' && !disabled;

    return (
      <div className={cn('w-full space-y-2', className)}>
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="decimal"
            pattern="[0-9]*\.?[0-9]*"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            aria-label={ariaLabel || 'Amount in USDC'}
            aria-invalid={showError}
            aria-describedby={cn(showError && errorId, helperId, ariaDescribedBy)}
            className={cn(
              'h-12 pr-24 text-right text-lg font-medium tabular-nums transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-offset-2',
              showError && 'border-destructive focus-visible:ring-destructive',
              isFocused && !showError && 'border-primary',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            placeholder="0.00"
          />

          {/* USDC Label */}
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <span className="text-sm font-semibold text-muted-foreground">USDC</span>
          </div>

          {/* Clear Button */}
          {showClearButton && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear amount"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Error Message */}
        {showError && (
          <p
            id={errorId}
            className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1"
            role="alert"
          >
            {validation.errorMessage}
          </p>
        )}

        {/* Helper Text */}
        <p id={helperId} className="text-xs text-muted-foreground">
          Min: ${MIN_AMOUNT.toFixed(DECIMAL_PLACES)}, Max: ${MAX_AMOUNT.toLocaleString()}
        </p>
      </div>
    );
  }
);

AmountInput.displayName = 'AmountInput';

export { AmountInput, MIN_AMOUNT, MAX_AMOUNT, DECIMAL_PLACES };
export type { ValidationState, ValidationError };

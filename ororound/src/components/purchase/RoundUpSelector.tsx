'use client';

import * as React from 'react';
import { Coins } from 'lucide-react';

import { cn } from '@/lib/utils';

export type RoundUpValue = 1 | 5 | 10;

export interface RoundUpOption {
  value: RoundUpValue;
  label: string;
  description: string;
}

export interface RoundUpSelectorProps {
  value?: RoundUpValue;
  onChange?: (value: RoundUpValue) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

const ROUND_UP_OPTIONS: RoundUpOption[] = [
  { value: 1, label: 'Round up to $1', description: 'Always round up to next dollar' },
  { value: 5, label: 'Round up to $5', description: 'Always round up to next $5' },
  { value: 10, label: 'Round up to $10', description: 'Always round up to next $10' },
];

const RoundUpSelector = React.forwardRef<HTMLDivElement, RoundUpSelectorProps>(
  ({ value = 1, onChange, disabled, className, id, 'aria-label': ariaLabel }, ref) => {
    const generatedGroupId = React.useId();
    const groupId = id ?? generatedGroupId;
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

    const handleSelect = React.useCallback(
      (selectedValue: RoundUpValue) => {
        if (!disabled) {
          onChange?.(selectedValue);
        }
      },
      [disabled, onChange]
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent, index: number) => {
        if (disabled) return;

        let newIndex = index;

        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault();
            newIndex = (index + 1) % ROUND_UP_OPTIONS.length;
            handleSelect(ROUND_UP_OPTIONS[newIndex].value);
            setFocusedIndex(newIndex);
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault();
            newIndex = index === 0 ? ROUND_UP_OPTIONS.length - 1 : index - 1;
            handleSelect(ROUND_UP_OPTIONS[newIndex].value);
            setFocusedIndex(newIndex);
            break;
          case 'Home':
            event.preventDefault();
            handleSelect(ROUND_UP_OPTIONS[0].value);
            setFocusedIndex(0);
            break;
          case 'End':
            event.preventDefault();
            handleSelect(ROUND_UP_OPTIONS[ROUND_UP_OPTIONS.length - 1].value);
            setFocusedIndex(ROUND_UP_OPTIONS.length - 1);
            break;
          case ' ':
          case 'Enter':
            event.preventDefault();
            handleSelect(ROUND_UP_OPTIONS[index].value);
            break;
        }
      },
      [disabled, handleSelect]
    );

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel || 'Select round up amount'}
        className={cn('w-full', className)}
      >
        <div className="grid grid-cols-3 gap-3">
          {ROUND_UP_OPTIONS.map((option, index) => {
            const isSelected = value === option.value;
            const isFocused = focusedIndex === index;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-labelledby={`${groupId}-label-${option.value}`}
                aria-describedby={`${groupId}-desc-${option.value}`}
                disabled={disabled}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelect(option.value)}
                onFocus={() => setFocusedIndex(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  'group relative flex flex-col items-center justify-center gap-2',
                  'rounded-lg border-2 p-4 transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'border-border bg-card text-card-foreground',
                  !disabled &&
                    !isSelected && [
                      'hover:border-primary/50 hover:bg-primary/5',
                      'hover:-translate-y-0.5 hover:shadow-md',
                    ],
                  isSelected && ['border-primary bg-primary/10', 'shadow-md'],
                  isFocused && !isSelected && ['border-primary/70'],
                  disabled && [
                    'cursor-not-allowed opacity-50',
                    'hover:translate-y-0 hover:border-border hover:bg-card hover:shadow-none',
                  ],
                  'active:scale-[0.98] active:duration-75'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                  )}
                >
                  <Coins className="h-5 w-5" />
                </div>

                <span
                  id={`${groupId}-label-${option.value}`}
                  className={cn(
                    'text-sm font-semibold transition-colors duration-200',
                    isSelected ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {option.label}
                </span>

                <span
                  id={`${groupId}-desc-${option.value}`}
                  className={cn(
                    'hidden text-xs transition-colors duration-200 sm:block',
                    isSelected ? 'text-primary/80' : 'text-muted-foreground'
                  )}
                >
                  {option.description}
                </span>

                {isSelected && (
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary duration-200 animate-in fade-in zoom-in" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

RoundUpSelector.displayName = 'RoundUpSelector';

export { RoundUpSelector, ROUND_UP_OPTIONS };

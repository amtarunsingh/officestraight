import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

// ── Button ──
type ButtonVariant = 'primary' | 'gold' | 'outline' | 'ghost' | 'danger' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-navy text-white border-transparent hover:bg-navy-light',
  gold: 'bg-gold text-white border-transparent hover:bg-gold-light',
  outline: 'bg-transparent text-navy border-navy hover:bg-navy/5',
  ghost: 'bg-transparent text-gray-500 border-gray-300 hover:bg-gray-50',
  danger: 'bg-transparent text-red-600 border-red-600 hover:bg-red-50',
  link: 'bg-transparent text-navy border-transparent underline hover:text-navy-light p-0',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20',
        buttonVariants[variant],
        buttonSizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

// ── Badge ──
type BadgeColor = 'navy' | 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'pending';

const badgeColors: Record<BadgeColor, string> = {
  navy: 'bg-navy text-white',
  gold: 'bg-gold text-white',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  muted: 'bg-gray-100 text-gray-600',
  pending: 'bg-orange-50 text-orange-800',
};

export function Badge({ children, color = 'navy' }: { children: React.ReactNode; color?: BadgeColor }) {
  return (
    <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap', badgeColors[color])}>
      {children}
    </span>
  );
}

// ── Input ──
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, hint, error, className, required, ...props }, ref) => (
    <div className={cn('mb-3', className)}>
      {label && (
        <label className="block text-xs font-semibold text-navy mb-1">
          {required && <span className="text-red-600">* </span>}
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 border rounded-md text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy',
          error ? 'border-red-400' : 'border-gray-300',
        )}
        {...props}
      />
      {hint && !error && <span className="text-xs text-gray-400 mt-0.5">{hint}</span>}
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  ),
);
InputField.displayName = 'InputField';

// ── Select ──
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<string | { label: string; value: string }>;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, className, ...props }, ref) => (
    <div className={cn('mb-3', className)}>
      {label && <label className="block text-xs font-semibold text-navy mb-1">{label}</label>}
      <select
        ref={ref}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-navy/20"
        {...props}
      >
        {options.map((o, i) => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          return <option key={i} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  ),
);
SelectField.displayName = 'SelectField';

// ── Radio Group ──
interface RadioGroupProps {
  label?: string;
  name: string;
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange?: (value: string) => void;
}

export function RadioGroup({ label, name, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="mb-2.5">
      {label && <div className="text-xs font-semibold text-navy mb-1.5">{label}</div>}
      <div className="flex gap-4 flex-wrap">
        {options.map((o) => (
          <label key={o.value} className="text-sm text-navy flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange?.(o.value)}
              className="accent-navy"
            />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}

// ── Checkbox ──
interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-start gap-2 text-sm text-navy cursor-pointer mb-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="accent-navy mt-0.5"
      />
      <span>{label}</span>
    </label>
  );
}

// ── Card ──
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('card', className)}>{children}</div>;
}

// ── Divider ──
export function Divider() {
  return <hr className="border-t border-gray-300 my-4" />;
}

// ── Steps Indicator ──
interface StepsProps {
  steps: string[];
  current: number;
}

export function Steps({ steps, current }: StepsProps) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {steps.map((s, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                isActive && 'bg-navy text-white',
                isDone && 'bg-gold text-white',
                !isActive && !isDone && 'bg-gray-200 text-gray-500',
              )}
            >
              {stepNum}
            </div>
            <span
              className={cn(
                'text-sm whitespace-nowrap',
                isActive && 'font-bold text-navy',
                !isActive && 'text-gray-500',
              )}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div className={cn('w-8 h-0.5 shrink-0', isDone ? 'bg-gold' : 'bg-gray-200')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Footer Actions (cancel or Save) ──
interface FooterActionsProps {
  onCancel: () => void;
  onSave?: () => void;
  saveLabel?: string;
  saveVariant?: ButtonVariant;
}

export function FooterActions({ onCancel, onSave, saveLabel = 'Save and continue', saveVariant = 'gold' }: FooterActionsProps) {
  return (
    <div className="flex justify-end items-center gap-2.5 mt-5">
      <Button variant="link" size="sm" onClick={onCancel}>cancel</Button>
      <span className="text-gray-400">or</span>
      <Button variant={saveVariant} size="lg" onClick={onSave}>{saveLabel}</Button>
    </div>
  );
}

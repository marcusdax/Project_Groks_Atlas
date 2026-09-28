import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";

/**
 * Numeric field that keeps the user's draft ("", "8.", "0.0") while typing and
 * only reports finite numbers upward. Empty commits as 0.
 */
export function NumberInput({
  value,
  onValue,
  ...props
}: Omit<ComponentProps<typeof Input>, "value" | "onChange" | "type"> & {
  value: number;
  onValue: (n: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={draft ?? String(value)}
      onChange={(e) => {
        const raw = e.target.value;
        if (!/^-?\d*\.?\d*$/.test(raw)) return;
        setDraft(raw);
        const n = Number.parseFloat(raw);
        onValue(Number.isFinite(n) ? n : 0);
      }}
      onBlur={(e) => {
        setDraft(null);
        props.onBlur?.(e);
      }}
    />
  );
}

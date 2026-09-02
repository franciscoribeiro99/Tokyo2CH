"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { submitContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/config/i18n";
import type { Dictionary } from "@/content/fr";
import { type ContactFieldErrors, initialContactState } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

type FormCopy = Dictionary["form"];

/** Marks a field as required for sighted users and screen readers alike. */
function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  // `w-auto` alone cannot shrink the button: the form is a flex column, whose
  // default `align-items: stretch` wins. Alignment is what needs changing.
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto sm:self-start">
      {pending ? pendingLabel : label}
    </Button>
  );
}

function FieldError({ id, errors }: { id: string; errors?: readonly string[] }) {
  if (!errors?.length) return null;

  return (
    <p id={id} className="text-destructive text-sm">
      {errors[0]}
    </p>
  );
}

interface NativeSelectProps {
  readonly id: string;
  readonly name: string;
  readonly options: readonly { readonly value: string; readonly label: string }[];
  readonly placeholder: string;
  /** Echoed back after a failed submission; "" selects the placeholder. */
  readonly value?: string;
  readonly invalid?: boolean;
  readonly describedBy?: string;
  readonly required?: boolean;
}

/**
 * A plain `<select>`, styled to match `Input`.
 *
 * Deliberately native rather than a custom listbox: it works before hydration,
 * gets the platform picker on mobile, and inherits keyboard and screen-reader
 * behaviour that a div-based replacement has to reimplement and usually gets
 * wrong. The empty first option is what makes "nothing chosen" fail validation.
 */
function NativeSelect({
  id,
  name,
  options,
  placeholder,
  value,
  invalid,
  describedBy,
  required,
}: NativeSelectProps) {
  const ref = useRef<HTMLSelectElement>(null);

  /**
   * Keep the DOM in step with the echoed value.
   *
   * On update React writes `defaultValue` through to `node.defaultValue` for an
   * input, but for a select it only assigns `.value` and never touches each
   * option's `defaultSelected` — so React's post-action form reset snapped the
   * choice back to the placeholder while the text fields kept their content.
   * Setting both the default and the current value makes this correct whichever
   * order the reset and this effect run in.
   */
  useEffect(() => {
    const select = ref.current;
    if (!select) return;

    const next = value ?? "";
    for (const option of select.options) {
      option.defaultSelected = option.value === next;
    }
    if (select.value !== next) select.value = next;
  }, [value]);

  return (
    <select
      ref={ref}
      id={id}
      name={name}
      defaultValue={value ?? ""}
      required={required}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      className={cn(
        "h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent bg-no-repeat px-2.5 py-1 pr-8 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
      )}
      /**
       * The chevron lives here, not in a Tailwind arbitrary value.
       * The class sorter reorders whitespace-separated tokens, and a data URI
       * contains spaces — it shredded the SVG into unusable fragments. An
       * inline style is not something the formatter will rewrite.
       */
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M3 6l5 5 5-5'/%3E%3C/svg%3E\")",
        backgroundSize: "0.7rem",
        backgroundPosition: "right 0.7rem center",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface ContactFormProps {
  readonly locale: Locale;
  readonly copy: FormCopy;
}

export function ContactForm({ locale, copy }: ContactFormProps) {
  const [state, formAction] = useActionState(submitContactForm, initialContactState);
  const formRef = useRef<HTMLFormElement>(null);
  const baseId = useId();

  const errors: ContactFieldErrors = state.fieldErrors ?? {};
  const id = (field: string) => `${baseId}-${field}`;
  const errorId = (field: string) => `${baseId}-${field}-error`;
  const describedBy = (field: keyof ContactFieldErrors) =>
    errors[field] ? errorId(field) : undefined;

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? copy.success);
      formRef.current?.reset();
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message ?? copy.errors.failed);
    }
  }, [state, copy]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6" noValidate>
      {/*
        Announce submission outcomes to screen readers. The toast alone is not
        reliably announced across browser/AT combinations.
      */}
      <p aria-live="polite" className="sr-only">
        {state.status !== "idle" ? state.message : ""}
      </p>

      {/* Name is one question asked in two boxes, so it is one group. */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-medium text-sm">{copy.name}</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Labels sit above their box: below, a stacked mobile layout puts
              them next to the *following* field and the pairing reads wrong. */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={id("firstName")} className="text-muted-foreground text-xs">
              {copy.first} <RequiredMark />
            </Label>
            <Input
              id={id("firstName")}
              name="firstName"
              defaultValue={state.values?.firstName ?? ""}
              autoComplete="given-name"
              required
              aria-invalid={!!errors.firstName}
              aria-describedby={describedBy("firstName")}
            />
            <FieldError id={errorId("firstName")} errors={errors.firstName} />
          </div>

          {/* Optional, and therefore unmarked: a first name plus a way to reply
              is enough to answer an enquiry. */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={id("lastName")} className="text-muted-foreground text-xs">
              {copy.last}
            </Label>
            <Input
              id={id("lastName")}
              name="lastName"
              defaultValue={state.values?.lastName ?? ""}
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              aria-describedby={describedBy("lastName")}
            />
            <FieldError id={errorId("lastName")} errors={errors.lastName} />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("email")}>
          {copy.email} <RequiredMark />
        </Label>
        <Input
          id={id("email")}
          name="email"
          defaultValue={state.values?.email ?? ""}
          type="email"
          autoComplete="email"
          required
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email")}
        />
        <FieldError id={errorId("email")} errors={errors.email} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("phone")}>{copy.phone}</Label>
        <Input
          id={id("phone")}
          name="phone"
          defaultValue={state.values?.phone ?? ""}
          type="tel"
          autoComplete="tel"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("vehicle")}>
          {copy.vehicle} <RequiredMark />
        </Label>
        <Input
          id={id("vehicle")}
          name="vehicle"
          defaultValue={state.values?.vehicle ?? ""}
          placeholder={copy.vehiclePlaceholder}
          required
          aria-invalid={!!errors.vehicle}
          aria-describedby={describedBy("vehicle")}
        />
        <FieldError id={errorId("vehicle")} errors={errors.vehicle} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={id("year")}>
            {copy.year} <RequiredMark />
          </Label>
          <Input
            id={id("year")}
            name="year"
            defaultValue={state.values?.year ?? ""}
            placeholder={copy.yearPlaceholder}
            required
            aria-invalid={!!errors.year}
            aria-describedby={describedBy("year")}
          />
          <FieldError id={errorId("year")} errors={errors.year} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={id("budget")}>
            {copy.budget} <RequiredMark />
          </Label>
          <Input
            id={id("budget")}
            name="budget"
            defaultValue={state.values?.budget ?? ""}
            placeholder={copy.budgetPlaceholder}
            required
            aria-invalid={!!errors.budget}
            aria-describedby={describedBy("budget")}
          />
          <FieldError id={errorId("budget")} errors={errors.budget} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={id("transmission")}>
            {copy.transmission} <RequiredMark />
          </Label>
          <NativeSelect
            id={id("transmission")}
            name="transmission"
            value={state.values?.transmission ?? ""}
            options={copy.transmissionOptions}
            placeholder={copy.selectPlaceholder}
            required
            invalid={!!errors.transmission}
            describedBy={describedBy("transmission")}
          />
          <FieldError id={errorId("transmission")} errors={errors.transmission} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={id("condition")}>
            {copy.condition} <RequiredMark />
          </Label>
          <NativeSelect
            id={id("condition")}
            name="condition"
            value={state.values?.condition ?? ""}
            options={copy.conditionOptions}
            placeholder={copy.selectPlaceholder}
            required
            invalid={!!errors.condition}
            describedBy={describedBy("condition")}
          />
          <FieldError id={errorId("condition")} errors={errors.condition} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("requirements")}>{copy.requirements}</Label>
        <Input
          id={id("requirements")}
          name="requirements"
          defaultValue={state.values?.requirements ?? ""}
          placeholder={copy.requirementsPlaceholder}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("notes")}>{copy.notes}</Label>
        <Textarea id={id("notes")} name="notes" defaultValue={state.values?.notes ?? ""} rows={5} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("referral")}>{copy.referral}</Label>
        <NativeSelect
          id={id("referral")}
          name="referral"
          value={state.values?.referral ?? ""}
          options={copy.referralOptions}
          placeholder={copy.selectPlaceholder}
        />
      </div>

      {/* Tells the Server Action which language to answer in. */}
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot — hidden from humans and from assistive tech. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${baseId}-website`}>{copy.honeypot}</label>
        <input id={`${baseId}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton label={copy.submit} pendingLabel={copy.submitting} />
    </form>
  );
}

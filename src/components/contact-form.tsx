"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { submitContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactForm, type SelectOption } from "@/config/content";
import { type ContactFieldErrors, initialContactState } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

/** Marks a field as required for sighted users and screen readers alike. */
function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto sm:self-start">
      {pending ? "Sending…" : "Request a vehicle"}
    </Button>
  );
}

interface FieldErrorProps {
  readonly id: string;
  readonly errors?: readonly string[];
}

function FieldError({ id, errors }: FieldErrorProps) {
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
  readonly options: readonly SelectOption[];
  readonly defaultValue?: string;
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
  defaultValue = "",
  invalid,
  describedBy,
  required,
}: NativeSelectProps) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue}
      required={required}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      className={cn(
        "h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-[length:0.7rem] bg-[position:right_0.7rem_center] bg-transparent bg-no-repeat px-2.5 py-1 pr-8 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
        "xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22%23888%22 d=%22M3 6l5 5 5-5%22/%3E%3C/svg%3E')] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg stroke-width=%222%22%3E%3Cpath",
      )}
    >
      <option value="">— Select Choice —</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function ContactForm() {
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
      toast.success(state.message ?? "Request sent.");
      formRef.current?.reset();
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message ?? "Something went wrong.");
    }
  }, [state]);

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
        <legend className="mb-2 font-medium text-sm">
          Your name <RequiredMark />
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Input
              id={id("firstName")}
              name="firstName"
              autoComplete="given-name"
              required
              aria-invalid={!!errors.firstName}
              aria-describedby={describedBy("firstName")}
            />
            <Label htmlFor={id("firstName")} className="text-muted-foreground text-xs">
              First
            </Label>
            <FieldError id={errorId("firstName")} errors={errors.firstName} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              id={id("lastName")}
              name="lastName"
              autoComplete="family-name"
              required
              aria-invalid={!!errors.lastName}
              aria-describedby={describedBy("lastName")}
            />
            <Label htmlFor={id("lastName")} className="text-muted-foreground text-xs">
              Last
            </Label>
            <FieldError id={errorId("lastName")} errors={errors.lastName} />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("email")}>
          Email address <RequiredMark />
        </Label>
        <Input
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email")}
        />
        <FieldError id={errorId("email")} errors={errors.email} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("phone")}>Phone / WhatsApp</Label>
        <Input id={id("phone")} name="phone" type="tel" autoComplete="tel" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("vehicle")}>
          What vehicle are you looking for? <RequiredMark />
        </Label>
        <Input
          id={id("vehicle")}
          name="vehicle"
          placeholder="e.g. Honda Civic Type R EK9"
          required
          aria-invalid={!!errors.vehicle}
          aria-describedby={describedBy("vehicle")}
        />
        <FieldError id={errorId("vehicle")} errors={errors.vehicle} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={id("year")}>
            Desired year / generation <RequiredMark />
          </Label>
          <Input
            id={id("year")}
            name="year"
            placeholder="e.g. 1996-2000"
            required
            aria-invalid={!!errors.year}
            aria-describedby={describedBy("year")}
          />
          <FieldError id={errorId("year")} errors={errors.year} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={id("budget")}>
            Budget (CHF) <RequiredMark />
          </Label>
          <Input
            id={id("budget")}
            name="budget"
            placeholder="e.g. CHF 35,000"
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
            Transmission <RequiredMark />
          </Label>
          <NativeSelect
            id={id("transmission")}
            name="transmission"
            options={contactForm.transmission}
            required
            invalid={!!errors.transmission}
            describedBy={describedBy("transmission")}
          />
          <FieldError id={errorId("transmission")} errors={errors.transmission} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={id("condition")}>
            Vehicle condition <RequiredMark />
          </Label>
          <NativeSelect
            id={id("condition")}
            name="condition"
            options={contactForm.condition}
            required
            invalid={!!errors.condition}
            describedBy={describedBy("condition")}
          />
          <FieldError id={errorId("condition")} errors={errors.condition} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("requirements")}>Additional requirements</Label>
        <Input
          id={id("requirements")}
          name="requirements"
          placeholder="Colour, mileage, specifications, modifications, etc."
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("notes")}>Anything else we should know?</Label>
        <Textarea id={id("notes")} name="notes" rows={5} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={id("referral")}>How did you hear about Tokyo2CH?</Label>
        <NativeSelect id={id("referral")} name="referral" options={contactForm.referral} />
      </div>

      {/* Honeypot — hidden from humans and from assistive tech. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${baseId}-website`}>Leave this field empty</label>
        <input id={`${baseId}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />
    </form>
  );
}

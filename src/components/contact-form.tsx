"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { submitContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialContactState } from "@/lib/contact-schema";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Sending…" : "Send message"}
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

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialContactState);
  const formRef = useRef<HTMLFormElement>(null);
  const baseId = useId();

  const ids = {
    name: `${baseId}-name`,
    email: `${baseId}-email`,
    company: `${baseId}-company`,
    message: `${baseId}-message`,
  };

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? "Message sent.");
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

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={ids.name}>
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id={ids.name}
            name="name"
            autoComplete="name"
            required
            aria-invalid={!!state.fieldErrors?.name}
            aria-describedby={state.fieldErrors?.name ? `${ids.name}-error` : undefined}
          />
          <FieldError id={`${ids.name}-error`} errors={state.fieldErrors?.name} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={ids.email}>
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id={ids.email}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!state.fieldErrors?.email}
            aria-describedby={state.fieldErrors?.email ? `${ids.email}-error` : undefined}
          />
          <FieldError id={`${ids.email}-error`} errors={state.fieldErrors?.email} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={ids.company}>Company</Label>
        <Input id={ids.company} name="company" autoComplete="organization" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={ids.message}>
          How can we help? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id={ids.message}
          name="message"
          rows={6}
          required
          aria-invalid={!!state.fieldErrors?.message}
          aria-describedby={state.fieldErrors?.message ? `${ids.message}-error` : undefined}
        />
        <FieldError id={`${ids.message}-error`} errors={state.fieldErrors?.message} />
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

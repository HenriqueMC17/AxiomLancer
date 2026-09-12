"use client";

import { useActionState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { submitLeadAction } from "@/lib/actions/submit-lead";
import { ActionState } from "@/lib/schemas/lead-capture-schema";

const initialState: ActionState = {
  success: false,
};

/**
 * Client Island - Lead Capture Form
 * Implements HTML POST contract, Fail Fast Zod validation, and WCAG 2.2 compliance.
 * Growth Emerald CTA button with Spring Easing.
 */
export function LeadCaptureForm() {
  const [state, formAction, isPending] = useActionState(submitLeadAction, initialState);

  return (
    <div className="w-full max-w-lg mx-auto">
      {state.success ? (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-center gap-2.5 backdrop-blur-md shadow-xl shadow-black/40"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="font-medium">{state.message}</span>
        </div>
      ) : (
        <form
          action={formAction}
          method="POST"
          className="space-y-3"
          noValidate
        >
          <input type="hidden" name="source" value="hero_cta" />

          <div className="relative flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <label htmlFor="hero-lead-email" className="sr-only">
                Seu e-mail profissional
              </label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="hero-lead-email"
                type="email"
                name="email"
                required
                aria-required="true"
                aria-invalid={!!state.errors?.email}
                aria-describedby={state.errors?.email ? "hero-email-error" : undefined}
                placeholder="Digite seu e-mail profissional..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#1A1A1A] border border-white/15 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:border-emerald-500 transition-[border-color,box-shadow] duration-150 shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-semibold text-sm transition-[background-color,box-shadow,transform,opacity] duration-150 shadow-lg shadow-[#2E7D32]/20 hover:shadow-[#2E7D32]/30 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden="true" />
                  <span>Ativando...</span>
                </>
              ) : (
                <>
                  <span>Comece seu teste gratuito de 14 dias</span>
                  <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          {state.errors?.email && (
            <p
              id="hero-email-error"
              role="alert"
              className="text-xs text-red-400 text-left pl-1 font-medium font-mono"
            >
              {state.errors.email[0]}
            </p>
          )}

          {state.message && !state.success && (
            <p
              role="alert"
              className="text-xs text-red-400 text-left pl-1 font-medium font-mono"
            >
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
"use client";

import { useActionState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { submitLeadAction } from "@/lib/actions/submit-lead";
import { ActionState } from "@/lib/schemas/lead-capture-schema";

const initialState: ActionState = {
  success: false,
};

/**
 * Client Island - Hero Lead Capture Form
 * - Botão de Ação Amber (#FF9900) com Touch Target >= 48px
 * - Validação Fail-Fast e suporte a A11y WCAG 2.2
 */
export function HeroCaptureForm() {
  const [state, formAction, isPending] = useActionState(submitLeadAction, initialState);

  return (
    <div className="w-full max-w-md mx-auto">
      {state.success ? (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-xl bg-amber-500/10 border border-[#FF9900]/30 text-amber-200 text-sm flex items-center justify-center gap-2.5 backdrop-blur-md shadow-xl shadow-black/60"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#FF9900]" />
          <span className="font-medium">{state.message || "Acesso prioritário liberado!"}</span>
        </div>
      ) : (
        <form
          action={formAction}
          method="POST"
          className="space-y-2.5"
          noValidate
        >
          <input type="hidden" name="source" value="hero_enterprise_redesign" />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Input Layer 1 */}
            <div className="relative flex-1">
              <label htmlFor="hero-email-input" className="sr-only">
                Seu e-mail profissional
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="hero-email-input"
                type="email"
                name="email"
                required
                aria-required="true"
                aria-invalid={!!state.errors?.email}
                aria-describedby={state.errors?.email ? "hero-email-err" : undefined}
                placeholder="seu.nome@empresa.com"
                className="w-full min-h-[48px] pl-11 pr-4 rounded-xl bg-[#1A1A1A] border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:border-transparent transition-[border-color,box-shadow] duration-150 shadow-inner"
              />
            </div>

            {/* CTA Button Amber (#FF9900) */}
            <button
              type="submit"
              disabled={isPending}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#FF9900] hover:bg-[#E68A00] text-black font-semibold text-sm transition-[background-color,transform,box-shadow,opacity] duration-150 shadow-lg shadow-[#FF9900]/25 hover:shadow-[#FF9900]/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF9900] focus-visible:ring-offset-[#0D0D0D]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" aria-hidden="true" />
                  <span>Inicializando...</span>
                </>
              ) : (
                <>
                  <span>Criar Conta Grátis</span>
                  <ArrowRight className="w-4 h-4 text-black" aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          {state.errors?.email && (
            <p
              id="hero-email-err"
              role="alert"
              className="text-xs text-red-400 text-left pl-1 font-mono font-medium"
            >
              {state.errors.email[0]}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

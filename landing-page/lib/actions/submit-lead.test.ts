import { describe, it, expect } from "vitest";
import { submitLeadAction } from "./submit-lead";

describe("submitLeadAction (Server Action)", () => {
  it("should successfully process a valid lead submission", async () => {
    const formData = new FormData();
    formData.append("email", "partner@axiomlancer.io");
    formData.append("source", "hero_cta");

    const result = await submitLeadAction({ success: false }, formData);

    expect(result.success).toBe(true);
    expect(result.message).toContain("Acesso antecipado liberado");
    expect(result.errors).toBeUndefined();
  });

  it("should fail validation and return field errors for invalid email", async () => {
    const formData = new FormData();
    formData.append("email", "not-an-email");

    const result = await submitLeadAction({ success: false }, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Falha na validação dos dados.");
    expect(result.errors?.email).toBeDefined();
    expect(result.errors?.email?.[0]).toBeDefined();
  });

  it("should fail validation if email field is missing or empty", async () => {
    const formData = new FormData();

    const result = await submitLeadAction({ success: false }, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.email).toBeDefined();
  });
});

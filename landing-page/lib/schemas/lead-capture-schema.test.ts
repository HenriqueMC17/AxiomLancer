import { describe, it, expect } from "vitest";
import { LeadCaptureSchema, createSafeDictionary } from "./lead-capture-schema";

describe("LeadCaptureSchema (Fail Fast Validation)", () => {
  it("should validate and normalize a valid corporate email", () => {
    const input = {
      email: "  TechLead@Enterprise.com  ",
      source: "hero_cta",
    };

    const result = LeadCaptureSchema.safeParse(input);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("techlead@enterprise.com");
      expect(result.data.source).toBe("hero_cta");
      expect(result.data.timestamp).toBeTypeOf("number");
    }
  });

  it("should apply default source when not provided", () => {
    const result = LeadCaptureSchema.safeParse({
      email: "engineer@axiomlancer.io",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("hero_lead_capture");
    }
  });

  it("should reject an invalid email address format", () => {
    const result = LeadCaptureSchema.safeParse({
      email: "invalid-email-format",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.email).toBeDefined();
      expect(errors.email?.[0]).toContain("inválido");
    }
  });

  it("should reject an empty email", () => {
    const result = LeadCaptureSchema.safeParse({
      email: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.email).toBeDefined();
    }
  });
});

describe("createSafeDictionary (Prototype Pollution Defense)", () => {
  it("should create an object with null prototype", () => {
    const safeMap = createSafeDictionary<string>();

    expect(Object.getPrototypeOf(safeMap)).toBeNull();
    expect(safeMap.constructor).toBeUndefined();
    expect(safeMap["__proto__"]).toBeUndefined();

    safeMap["apiKey"] = "axiom_live_secret";
    expect(safeMap["apiKey"]).toBe("axiom_live_secret");
  });
});

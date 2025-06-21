import { validateDNI } from "./validateDNI";

test("DNI válido", () => {
  expect(validateDNI("12345678")).toBe(true);
});

test("DNI inválido", () => {
  expect(validateDNI("abc")).toBe(false);
});
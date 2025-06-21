import { validateEmail } from "./validateEmail";

test("correo válido", () => {
  expect(validateEmail("test@email.com")).toBe(true);
});

test("correo inválido", () => {
  expect(validateEmail("email.com")).toBe(false);
});

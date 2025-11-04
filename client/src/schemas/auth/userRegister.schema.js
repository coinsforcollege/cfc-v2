import z from "zod";

export const studentStep1Schema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .regex(/\S+@\S+\.\S+/, "Please enter a valid email address"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: z
    .string()
    .nonempty("Please confirm your password"),

  firstName: z
    .string()
    .nonempty("First name is required")
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),

  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  })
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const studentStep2Schema = z.object({
  college: z.string().min(1, 'Please select a college'),
  graduationYear: z
    .number()
    .min(1, 'Please select your graduation year')
    .min(2024, 'Graduation year must be 2024 or later')
    .max(2030, 'Graduation year cannot be later than 2030'),
});

export const studentStep3Schema = z.object({
  emailCode: z
    .string()
    .min(1, 'Email verification code is required')
    .regex(/^\d{6}$/, 'Email verification code must be 6 digits'),
  phoneCode: z
    .string()
    .min(1, 'Phone verification code is required')
    .regex(/^\d{6}$/, 'Phone verification code must be 6 digits'),
});
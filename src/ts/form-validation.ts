type ValidatorState = {
  name: string;
  email: string;
  phone: string; // converted from emirates -> phone
  message: string;
  touched: Record<string, boolean>;
  errors: Record<string, string>;
};

// Basic email regex (not perfect but practical)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone: allow +, digits, spaces and -; require between 7 and 15 digits when stripped
const PHONE_ALLOWED = /^[0-9+\s-]*$/;

function createErrorElement(input: HTMLElement, message: string) {
  let el = input.parentElement?.querySelector(
    ".error-message"
  ) as HTMLElement | null;
  if (!el) {
    el = document.createElement("div");
    el.className = "error-message absolute top-full text-red-600 text-sm mt-1";
    input.parentElement?.appendChild(el);
  }
  el.textContent = message;
}

function clearErrorElement(input: HTMLElement) {
  const el = input.parentElement?.querySelector(
    ".error-message"
  ) as HTMLElement | null;
  if (el) el.textContent = "";
}

function validateField(
  key: keyof Omit<ValidatorState, "errors">,
  value: string
): string | null {
  const v = value?.trim() ?? "";
  const isRtl = document.documentElement.dir === "rtl";
  const validationMessages = Object.freeze({
    name: {
      min: isRtl
        ? "الاسم يجب أن يحتوي على 3 أحرف على الأقل"
        : "The name must contain at least 3 letters",
    },
    email: {
      required: isRtl
        ? "الرجاء إدخال البريد الإلكتروني"
        : "Please enter your email address.",
		valid: isRtl ? "الرجاء إدخال بريد إلكتروني صالح":"Please enter a valid email address."
    },
	phone:{
		required:isRtl ? "الرجاء إدخال رقم الهاتف": "Please enter your phone number.",
		valid:isRtl ? "رقم الهاتف يحتوي غير صحيح":"The phone number contains an incorrect number.",
		minmax:isRtl?"رقم الهاتف يجب أن يحتوي بين 7 و 15 رقماً":"The phone number must contain between 7 and 15 digits.",
	},
	message:{
		min:isRtl?"الرسالة يجب أن تحتوي على 10 أحرف على الأقل":"The message must contain at least 10 characters."
	}
  });
  switch (key) {
    case "name":
      if (!v || v.length < 3) return validationMessages.name.min;
      return null;
    case "email":
      if (!v) return validationMessages.email.required;
      if (!EMAIL_REGEX.test(v)) return validationMessages.email.valid;
      return null;
    case "phone":
      if (!v) return validationMessages.phone.required;
      if (!PHONE_ALLOWED.test(v))
        return validationMessages.phone.valid;
      const digits = v.replace(/[^0-9]/g, "");
      if (digits.length < 7 || digits.length > 15)
        return validationMessages.phone.minmax;
      return null;
    case "message":
      if (!v || v.length < 10)
        return "الرسالة يجب أن تحتوي على 10 أحرف على الأقل";
      return null;
    default:
      return null;
  }
}

export default function initFormValidation(opts?: { formSelector?: string }) {
  const formSelector = opts?.formSelector ?? 'form[data-validate="true"]';
  const forms = Array.from(
    document.querySelectorAll<HTMLFormElement>(formSelector)
  );
  if (!forms.length) return;

  forms.forEach((form) => {
    // find inputs by either name or data-validate attribute
    const nameInput = form.querySelector<HTMLInputElement>(
      'input[name="name"], input[data-validate="name"]'
    );
    const emailInput = form.querySelector<HTMLInputElement>(
      'input[name="email"], input[data-validate="email"]'
    );
    const phoneInput = form.querySelector<HTMLInputElement>(
      'input[name="phone"], input[data-validate="phone"]'
    );
    const messageInput = form.querySelector<HTMLTextAreaElement>(
      'textarea[name="message"], textarea[data-validate="message"]'
    );

    // Create state
    const initialState: ValidatorState = {
      name: nameInput?.value ?? "",
      email: emailInput?.value ?? "",
      phone: phoneInput?.value ?? "",
      message: messageInput?.value ?? "",
      errors: {},
      touched: {},
    };

    const handler: ProxyHandler<ValidatorState> = {
      set(target, prop: string, value) {
        if (prop === "errors") {
          (target as any)[prop] = value;
          return true;
        }

        if (prop in target) {
          (target as any)[prop] = value;

          // run validation for this property if it's one of the fields
          if (
            prop === "name" ||
            prop === "email" ||
            prop === "phone" ||
            prop === "message"
          ) {
            const key = prop as keyof Omit<ValidatorState, "errors">;
            const message = validateField(key, String(value));
            if (message) {
              target.errors[key] = message;
            } else {
              delete target.errors[key];
            }

            // Update UI immediately
            const inputEl =
              key === "name"
                ? nameInput
                : key === "email"
                ? emailInput
                : key === "phone"
                ? phoneInput
                : messageInput;
            if (state.touched[key]) {
              if (inputEl) {
                if (message) {
                  inputEl.classList.add("invalid");
                  createErrorElement(inputEl as HTMLElement, message);
                } else {
                  inputEl.classList.remove("invalid");
                  clearErrorElement(inputEl as HTMLElement);
                }
              }
            }
          }

          return true;
        }

        (target as any)[prop] = value;
        return true;
      },
    };

    const state = new Proxy<ValidatorState>(initialState, handler);

    // Attach event listeners for realtime validation
    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        state.name = (e.target as HTMLInputElement).value;
      });
      nameInput.addEventListener("blur", () => {
        state.touched.name = true;
        state.name = nameInput.value;
      });
    }

    if (emailInput) {
      emailInput.addEventListener("input", (e) => {
        state.email = (e.target as HTMLInputElement).value;
      });
      emailInput.addEventListener("blur", () => {
        state.touched.email = true;
        state.email = emailInput.value;
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        const raw = (e.target as HTMLInputElement).value;
        // allow digits, +, space and hyphen
        const filtered = raw.replace(/[^0-9+\s-]/g, "");
        if (filtered !== raw) (e.target as HTMLInputElement).value = filtered;
        state.phone = filtered;
      });
      phoneInput.addEventListener("blur", () => {
        state.touched.phone = true;
        state.phone = phoneInput.value;
      });
    }

    if (messageInput) {
      messageInput.addEventListener("input", (e) => {
        state.message = (e.target as HTMLTextAreaElement).value;
      });
      messageInput.addEventListener("blur", () => {
        state.touched.message = true;
        state.message = messageInput.value;
      });
    }

    // On submit, validate everything and prevent submission if invalid
    form.addEventListener("submit", (e) => {
      if (nameInput) state.name = nameInput.value;
      if (emailInput) state.email = emailInput.value;
      if (phoneInput) state.phone = phoneInput.value;
      if (messageInput) state.message = messageInput.value;

      const hasErrors = Object.keys(state.errors).length > 0;
      if (hasErrors) {
        e.preventDefault();
        const firstKey = Object.keys(
          state.errors
        )[0] as keyof typeof state.errors;
        const el =
          firstKey === "name"
            ? nameInput
            : firstKey === "email"
            ? emailInput
            : firstKey === "phone"
            ? phoneInput
            : messageInput;
        el?.focus();
      }
    });

    // initial validation run
    if (nameInput) state.name = nameInput.value;
    if (emailInput) state.email = emailInput.value;
    if (phoneInput) state.phone = phoneInput.value;
    if (messageInput) state.message = messageInput.value;
  });
}

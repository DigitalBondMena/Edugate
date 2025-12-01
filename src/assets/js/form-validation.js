// Basic email regex (not perfect but practical)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone: allow +, digits, spaces and -; require between 7 and 15 digits when stripped
let iti = null;
function createErrorElement(input, message) {
  let el = input.parentElement?.querySelector(".error-message");
  if (!el) {
    el = document.createElement("div");
    el.className = "error-message absolute top-full text-red-600 text-sm mt-1";
    input.parentElement?.appendChild(el);
  }
  el.textContent = message;
}

function clearErrorElement(input) {
  const el = input.parentElement?.querySelector(".error-message");
  if (el) el.textContent = "";
}

function validateField(key, value) {
  const v = value?.trim() ?? "";
  const isRtl = document.documentElement.dir === "rtl";

  const validationMessages = {
    name: {
      min: isRtl
        ? "الاسم يجب أن يحتوي على 3 أحرف على الأقل"
        : "The name must contain at least 3 letters",
    },
    email: {
      required: isRtl
        ? "الرجاء إدخال البريد الإلكتروني"
        : "Please enter your email address.",
      valid: isRtl
        ? "الرجاء إدخال بريد إلكتروني صالح"
        : "Please enter a valid email address.",
    },
    phone: {
      required: isRtl ? "الرجاء إدخال رقم الهاتف" : "Please enter your phone number.",
      valid: isRtl ? "رقم الهاتف غير صحيح" : "The phone number contains an incorrect number.",
    },
    message: {
      min: isRtl
        ? "الرسالة يجب أن تحتوي على 10 أحرف على الأقل"
        : "The message must contain at least 10 characters.",
    },
  };

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
      if (!iti.isValidNumber()) {
        return validationMessages.phone.valid
      };
      return null;
    case "message":
      if (!v || v.length < 10) return validationMessages.message.min;
      return null;
    default:
      return null;
  }
}

function initFormValidation(opts) {
  const formSelector = opts?.formSelector ?? 'form[data-validate="true"]';
  const forms = Array.from(document.querySelectorAll(formSelector));
  if (!forms.length) return;

  forms.forEach((form) => {
    const nameInput = form.querySelector('input[name="name"], input[data-validate="name"]');
    const emailInput = form.querySelector('input[name="email"], input[data-validate="email"]');
    const phoneInput = form.querySelector('input[name="phone"], input[data-validate="phone"]');
    const messageInput = form.querySelector('textarea[name="message"], textarea[data-validate="message"]');
   iti = window.intlTelInput(phoneInput, {
    initialCountry: "eg",
    preferredCountries: ["eg", "sa", "ae"],
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
  });
    const state = {
      name: nameInput?.value ?? "",
      email: emailInput?.value ?? "",
      phone: phoneInput?.value ?? "",
      message: messageInput?.value ?? "",
      errors: {},
      touched: {},
    };

    function handleInput(key, input) {
      const value = input.value;
      const error = validateField(key, value);

      state[key] = value;

      if (state.touched[key]) {
        if (error) createErrorElement(input, error);
        else clearErrorElement(input);
      }

      state.errors[key] = error;
    }

    function markTouched(key, input) {
      state.touched[key] = true;
      const error = validateField(key, input.value);

      if (error) createErrorElement(input, error);
      else clearErrorElement(input);
    }

    if (nameInput) {
      nameInput.addEventListener("input", () => handleInput("name", nameInput));
      nameInput.addEventListener("blur", () => markTouched("name", nameInput));
    }

    if (emailInput) {
      emailInput.addEventListener("input", () => handleInput("email", emailInput));
      emailInput.addEventListener("blur", () => markTouched("email", emailInput));
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", () => handleInput("phone", phoneInput));
      phoneInput.addEventListener("blur", () => markTouched("phone", phoneInput));
    }

    if (messageInput) {
      messageInput.addEventListener("input", () => handleInput("message", messageInput));
      messageInput.addEventListener("blur", () => markTouched("message", messageInput));
    }

    form.addEventListener("submit", (e) => {
      let hasError = false;

      ["name", "email", "phone", "message"].forEach((key) => {
        const input =
          key === "message" ? messageInput
          : key === "phone" ? phoneInput
          : key === "email" ? emailInput
          : nameInput;

        if (!input) return;

        const error = validateField(key, input.value);
        state.errors[key] = error;
        state.touched[key] = true;

        if (error) {
          createErrorElement(input, error);
          hasError = true;
        }
      });

      if (hasError) {
        e.preventDefault();
      } else {
        document.getElementById("actualPhone").value = iti.getNumber();
      }
    });
  });
}
const initMainListener = () => {
  document.querySelectorAll('[type="number"],[type="tel"],.preventText').forEach(e => {
  e.addEventListener("input",(e) => {
    const input = e.target;
    input.value = input.value.replace(/[^0-9]/g,"")
  })
})
  document.querySelectorAll('.preventNumber').forEach(e => {
  e.addEventListener("input",(e) => {
    const input = e.target;
    input.value = input.value.replace(/[0-9]/g,"")
  })
})
}
const initForm = () => {
  initFormValidation();
  initMainListener()
}
// start form
initForm()
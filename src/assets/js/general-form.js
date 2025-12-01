document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("studyForm");
  const studyType = document.getElementById("studyType");

  const fields = {
    bachelor: document.getElementById("bachelorFields"),
    master: document.getElementById("masterFields"),
    doctorate: document.getElementById("doctorateFields"),
  };

  const inputs = {
    name: document.getElementById("nameInput"),
    AcademicSpecialization: document.getElementById("AcademicSpecializationInput"),
    email: document.getElementById("emailInput"),
    phone: document.getElementById("phoneInput"),
    nationality: document.getElementById("nationalityInput"),
    country: document.getElementById("country"),
    academicBifurcation: document.getElementById("academicBifurcationInput"),
    academicAverage: document.getElementById("academicAverageInput"),
    BachelorsDegreeMajor: document.getElementById("BachelorsDegreeMajorInput"),
    mastersDegreeMajor: document.getElementById("mastersDegreeMajorInput"),
    requiredSpecialization: document.getElementById("requiredSpecializationInput"),
  };

  const errors = {
    name: document.getElementById("nameError"),
    AcademicSpecialization: document.getElementById("AcademicSpecializationError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    nationality: document.getElementById("nationalityError"),
    country: document.getElementById("countryError"),
    studyType: document.getElementById("studyTypeError"),
    academicBifurcation: document.getElementById("academicBifurcationError"),
    academicAverage: document.getElementById("academicAverageError"),
    BachelorsDegreeMajor: document.getElementById("BachelorsDegreeMajorError"),
    mastersDegreeMajor: document.getElementById("mastersDegreeMajorError"),
    requiredSpecialization: document.getElementById("requiredSpecializationError"),
  };

  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("loadingSpinner");

  // Initialize intl-tel-input
  const iti = window.intlTelInput(inputs.phone, {
    initialCountry: "sa",
    preferredCountries: ["eg", "sa", "ae"],
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
  });

  // Toggle fields based on study type
  studyType.addEventListener("change", () => {
    Object.values(fields).forEach((f) => f.classList.add("hidden"));
    if (studyType.value && fields[studyType.value])
      fields[studyType.value].classList.remove("hidden");
  });

  function toggleError(el, valid) {
    el.style.opacity = valid ? "0" : "1";
  }

  // Validation functions
  const validateName = (v) => v.trim().length >= 3 && !/\d/.test(v);
  const validateAcademicSpecialization =(v) => v.trim() !== "";
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/i.test(v.trim());
  const validatePhone = () => inputs.phone.value.trim() && iti.isValidNumber();
  const validateNationality = (v) => v.trim() !== "";
  const validateCountry = (v) => v !== "";
  const validateNotEmpty = (v) => v.trim() !== "";
  const validateStudyType = (v) => v !== "";

  // ✅ Real-time validation setup
  function setupRealTimeValidation(input, validator, errorElement) {
    const validateAndToggle = () => {
      const valid = validator(input.value);
      toggleError(errorElement, valid);
    };
    input.addEventListener("input", validateAndToggle);
    input.addEventListener("blur", validateAndToggle);
  }

  setupRealTimeValidation(inputs.name, validateName, errors?.name);
  setupRealTimeValidation(inputs.AcademicSpecialization, validateAcademicSpecialization, errors?.AcademicSpecialization);
  setupRealTimeValidation(inputs.email, validateEmail, errors?.email);
  setupRealTimeValidation(inputs.nationality, validateNationality, errors?.nationality);
  // Country select real-time validation
  if (inputs.country) {
    inputs.country.addEventListener("change", () => {
      toggleError(errors?.country, validateCountry(inputs?.country.value));
    });
  }
  inputs.phone.addEventListener("blur", () => toggleError(errors?.phone, validatePhone()));
  inputs.phone.addEventListener("input", () => toggleError(errors?.phone, validatePhone()));

  studyType.addEventListener("change", () => {
    toggleError(errors?.studyType, validateStudyType(studyType?.value));
  });

  // ✅ Dynamic fields real-time
  function setupDynamicValidation() {
    if (studyType?.value === "bachelor") {
      setupRealTimeValidation(inputs.academicBifurcation, validateNotEmpty, errors?.academicBifurcation);
      setupRealTimeValidation(inputs.academicAverage, validateNotEmpty, errors?.academicAverage);
    } else if (studyType.value === "master") {
      setupRealTimeValidation(inputs.BachelorsDegreeMajor, validateNotEmpty, errors?.BachelorsDegreeMajor);
    } else if (studyType.value === "doctorate") {
      setupRealTimeValidation(inputs.mastersDegreeMajor, validateNotEmpty, errors?.mastersDegreeMajor);
      setupRealTimeValidation(inputs.requiredSpecialization, validateNotEmpty, errors?.requiredSpecialization);
    }
  }

  studyType.addEventListener("change", setupDynamicValidation);

  // Submit handler
  form.addEventListener("submit", async (e) => {
    const isValid = {
      name: validateName(inputs.name.value),
      email: validateEmail(inputs.email.value),
      AcademicSpecialization:(inputs.AcademicSpecialization.value),
      phone: validatePhone(),
      nationality: validateNationality(inputs.nationality.value),
      country: validateCountry(inputs.country?.value || ""),
      studyType: validateStudyType(studyType.value),
    };

    toggleError(errors?.name, isValid?.name);
    toggleError(errors?.AcademicSpecialization, isValid?.AcademicSpecialization);
    toggleError(errors?.email, isValid?.email);
    toggleError(errors?.phone, isValid?.phone);
    toggleError(errors?.nationality, isValid?.nationality);
    toggleError(errors?.country, isValid?.country);
    toggleError(errors?.studyType, isValid?.studyType);

    // Dynamic fields validation on submit
    if (studyType.value === "bachelor") {
      isValid.academicBifurcation = validateNotEmpty(inputs.academicBifurcation.value);
      isValid.academicAverage = validateNotEmpty(inputs.academicAverage.value);
      toggleError(errors?.academicBifurcation, isValid?.academicBifurcation);
      toggleError(errors?.academicAverage, isValid?.academicAverage);
    } else if (studyType.value === "master") {
      isValid.BachelorsDegreeMajor = validateNotEmpty(inputs.BachelorsDegreeMajor.value);
      toggleError(errors?.BachelorsDegreeMajor, isValid?.BachelorsDegreeMajor);
    } else if (studyType.value === "doctorate") {
      isValid.mastersDegreeMajor = validateNotEmpty(inputs.mastersDegreeMajor.value);
      isValid.requiredSpecialization = validateNotEmpty(inputs.requiredSpecialization.value);
      toggleError(errors?.mastersDegreeMajor, isValid?.mastersDegreeMajor);
      toggleError(errors?.requiredSpecialization, isValid?.requiredSpecialization);
    }

    if (Object.values(isValid).includes(false)) {
        e.preventDefault()
        return
    };

    // Save full phone
    const dialCode = iti.getSelectedCountryData()?.dialCode || "20";
    document.getElementById("actualPhone").value = `+${dialCode}${inputs.phone.value.trim()}`;

    btnText.textContent = "Sending...";
    spinner.classList.remove("hidden");
    submitBtn.disabled = true;
    
  });
});
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
initMainListener();
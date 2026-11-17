(() => {
  'use strict';

  // ── Element Selectors ──────────────────────────────────────────────
  const form = document.getElementById('applicationForm');
  if (!form) return;

  const steps = [...form.querySelectorAll('.form-step')];
  const count = document.getElementById('stepCount');
  const bar = document.getElementById('progressBar');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const errorBox = document.getElementById('formError');
  const successBox = document.getElementById('formSuccess');
  const successSummary = document.getElementById('successSummary');
  const programRadios = [...form.querySelectorAll('input[name="programChoice"]')];
  const programDropdown = document.getElementById('programSelectDropdown');

  let currentStep = 0;

  // ── Populate Date of Birth Selects ────────────────────────────────
  const daySelect = form.querySelector('[name="birthDay"]');
  if (daySelect) {
    for (let d = 1; d <= 31; d++) {
      const val = String(d).padStart(2, '0');
      daySelect.add(new Option(val, val));
    }
  }

  const monthSelect = form.querySelector('[name="birthMonth"]');
  if (monthSelect) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.forEach((m, idx) => {
      const val = String(idx + 1).padStart(2, '0');
      monthSelect.add(new Option(`${val} - ${m}`, val));
    });
  }

  const yearSelect = form.querySelector('[name="birthYear"]');
  if (yearSelect) {
    const currentYear = new Date().getFullYear();
    // Bachelor applicants typically aged 16 to 45
    for (let y = currentYear - 16; y >= currentYear - 60; y--) {
      yearSelect.add(new Option(String(y), String(y)));
    }
  }

  // ── Sync Program Radio Choices with Dropdown ───────────────────────
  function setProgramChoice(programName) {
    const matchedRadio = programRadios.find(r => r.value === programName);
    if (matchedRadio) {
      matchedRadio.checked = true;
    }
    if (programDropdown) {
      programDropdown.value = programName;
    }
  }

  programRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (programDropdown) {
        programDropdown.value = radio.value;
      }
    });
  });

  if (programDropdown) {
    programDropdown.addEventListener('change', () => {
      setProgramChoice(programDropdown.value);
    });
  }

  // ── Multi-Step Form Navigation ────────────────────────────────────
  function showStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStep);
    });

    if (count) {
      count.textContent = `${String(currentStep + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
    }

    if (bar) {
      const percentage = ((currentStep + 1) / steps.length) * 100;
      bar.style.width = `${percentage}%`;
    }

    if (prevBtn) prevBtn.disabled = currentStep === 0;
    if (nextBtn) nextBtn.hidden = currentStep === steps.length - 1;
    if (submitBtn) submitBtn.hidden = currentStep !== steps.length - 1;
    if (errorBox) errorBox.textContent = '';
  }

  function validateCurrentStep() {
    const activeStep = steps[currentStep];
    const inputs = [...activeStep.querySelectorAll('input, select')];

    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        if (errorBox) {
          errorBox.textContent = 'Please complete all required fields correctly to proceed.';
        }
        return false;
      }
    }

    if (errorBox) errorBox.textContent = '';
    return true;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateCurrentStep()) {
        showStep(currentStep + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showStep(currentStep - 1);
    });
  }

  // ── Form Submission (Demo / Lead Capture Ready) ───────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const formData = new FormData(form);
    const selectedProg = formData.get('programChoice') || 'Bachelor Degree';
    const firstName = formData.get('firstName') || 'Applicant';

    if (successSummary) {
      successSummary.innerHTML = `
        Thank you, <strong>${firstName}</strong>! Your enquiry for the <strong>${selectedProg}</strong> at EM Normandie Dubai has been received. 
        Our admissions committee will contact you within 24 hours with full curriculum details, fee schedules, and scholarship guidance.
      `;
    }

    form.hidden = true;
    if (successBox) successBox.hidden = false;
  });

  // ── External "Select This Program" Buttons ────────────────────────
  const selectProgramButtons = document.querySelectorAll('.select-program-btn');
  selectProgramButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const programTarget = btn.getAttribute('data-program-choice');
      if (programTarget) {
        setProgramChoice(programTarget);
        showStep(0); // Show step 1 where the program is selected
      }
    });
  });

  // ── Hero Visual Mini-Cards Click Interactivity ────────────────────
  const heroMiniCards = document.querySelectorAll('.mini-card');
  heroMiniCards.forEach(card => {
    card.addEventListener('click', () => {
      heroMiniCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const progName = card.getAttribute('data-program');
      if (progName) {
        setProgramChoice(progName);
        const applySection = document.getElementById('apply');
        if (applySection) {
          applySection.scrollIntoView({ behavior: 'smooth' });
          showStep(0);
        }
      }
    });
  });

  // Initialize first step
  showStep(0);

})();

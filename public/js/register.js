// Static onboarding flow. Nothing is sent to a server yet —
// data is kept in memory until the email service is added.

const TOTAL_STEPS = 4;
const screens = document.querySelectorAll('.step-screen');
const progress = document.querySelector('.progress');
const progressFill = document.querySelector('.progress-bar span');
const stepCurrent = document.getElementById('step-current');
document.getElementById('step-total').textContent = TOTAL_STEPS;

const data = { email: '', name: '', age: '', gender: '', country: '', interests: [] };
let current = 1;

const showStep = (step) => {
  current = step;
  screens.forEach((s) => s.classList.toggle('active', Number(s.dataset.step) === step));

  const done = step > TOTAL_STEPS;
  progress.classList.toggle('hidden', done);
  progressFill.style.width = `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%`;
  stepCurrent.textContent = Math.min(step, TOTAL_STEPS);

  const firstInput = document.querySelector('.step-screen.active input, .step-screen.active select');
  if (firstInput) firstInput.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.querySelectorAll('[data-next]').forEach((btn) =>
  btn.addEventListener('click', () => showStep(current + 1))
);
document.querySelectorAll('[data-prev]').forEach((btn) =>
  btn.addEventListener('click', () => showStep(current - 1))
);

const setError = (id, msg) => {
  document.getElementById(id).textContent = msg;
};

// Step 2: email
document.querySelector('[data-form="email"]').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.email;
  const value = input.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  input.classList.toggle('invalid', !valid);
  if (!valid) return setError('email-error', 'Please enter a valid email address.');

  setError('email-error', '');
  data.email = value;
  showStep(3);
});

// Step 3: profile
document.querySelector('[data-form="profile"]').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const required = [form.name, form.age, form.country];
  let ok = true;

  required.forEach((field) => {
    const empty = !field.value.trim();
    field.classList.toggle('invalid', empty);
    if (empty) ok = false;
  });
  if (!ok) return setError('profile-error', 'Please fill in your name, age range and country.');

  setError('profile-error', '');
  data.name = form.name.value.trim();
  data.age = form.age.value;
  data.gender = form.gender.value;
  data.country = form.country.value;
  showStep(4);
});

// Step 4: interests
document.querySelector('[data-form="interests"]').addEventListener('submit', (e) => {
  e.preventDefault();
  const picked = [...e.target.querySelectorAll('input[name="interests"]:checked')].map((i) => i.value);

  if (picked.length < 3) return setError('interests-error', `Pick ${3 - picked.length} more to continue.`);

  setError('interests-error', '');
  data.interests = picked;

  // TODO: send `data` to the backend / email service here.
  console.log('[QForms] registration data:', data);

  document.getElementById('done-name').textContent = data.name;
  document.getElementById('done-email').textContent = data.email;
  showStep(5);
});

// Prefill email if it came from the landing page form (?email=...)
const prefill = new URLSearchParams(window.location.search).get('email');
if (prefill) {
  document.getElementById('email').value = prefill;
  showStep(2);
}

const loginForm = document.getElementById('login-form');
const registerButton = document.getElementById('show-register');
const loginButton = document.getElementById('show-login');
const message = document.getElementById('login-message');
const signupFields = document.querySelector('.signup-only');
const nameInput = document.getElementById('name');
const formEyebrow = document.getElementById('form-eyebrow');
const formTitle = document.getElementById('form-title');
const formIntro = document.getElementById('form-intro');
const submitButton = document.getElementById('submit-button');
let isRegistering = false;

function showMessage(text, isError) {
  message.textContent = text;
  message.className = isError ? 'form-message error' : 'form-message success';
}

async function sendRequest(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Something went wrong');
  return result;
}

function setFormMode(registerMode) {
  isRegistering = registerMode;
  signupFields.hidden = !registerMode;
  nameInput.required = registerMode;
  nameInput.autocomplete = registerMode ? 'name' : 'off';
  document.getElementById('password').autocomplete = registerMode ? 'new-password' : 'current-password';
  formEyebrow.textContent = registerMode ? 'Get started' : 'Welcome back';
  formTitle.innerHTML = registerMode ? 'Create your<br>second brain.' : 'Sign in to your<br>second brain.';
  formIntro.textContent = registerMode ? 'Keep your important files close.' : 'Your files are waiting for you.';
  submitButton.textContent = registerMode ? 'Create account' : 'Log in';
  registerButton.hidden = registerMode;
  loginButton.hidden = !registerMode;
  message.textContent = '';
  message.className = 'form-message';
}

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  try {
    const data = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
    if (isRegistering) data.name = nameInput.value;
    const result = await sendRequest(isRegistering ? '/auth/register' : '/auth/login', data);
    localStorage.setItem('fileUploadToken', result.token);
    window.location.href = '/dashboard';
  } catch (error) { showMessage(error.message, true); }
});

registerButton.addEventListener('click', function () { setFormMode(true); });
loginButton.addEventListener('click', function () { setFormMode(false); });

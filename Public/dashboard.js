const token = localStorage.getItem('fileUploadToken');
const fileInput = document.getElementById('myFile');
const dropArea = document.getElementById('drop-area');
const fileName = document.getElementById('file-name');
const uploadMessage = document.getElementById('upload-message');
const allFilesButton = document.getElementById('all-files');
const filesHeading = document.getElementById('files-heading');
let isAdmin = false;
let showingAllFiles = false;

if (!token) window.location.href = '/login';

function showMessage(text, isError) {
  uploadMessage.textContent = text;
  uploadMessage.className = isError ? 'form-message error' : 'form-message success';
}

function selectFile(file) {
  if (!file) return;
  const fileTransfer = new DataTransfer();
  fileTransfer.items.add(file);
  fileInput.files = fileTransfer.files;
  fileName.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MiB`;
}

async function readResponse(response) {
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || result.msg || 'Request failed');
  return result;
}

async function loadFiles() {
  try {
    const endpoint = showingAllFiles ? '/admin/files' : '/files';
    const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
    const result = await readResponse(response);
    const fileList = document.getElementById('files');
    fileList.textContent = '';
    if (result.files.length === 0) {
      fileList.innerHTML = '<li class="empty-files">No files yet. Your archive is waiting.</li>';
      return;
    }
    result.files.forEach(function (file) {
      const item = document.createElement('li');
      item.className = 'file-item';
      item.tabIndex = 0;
      item.setAttribute('role', 'link');
      const icon = document.createElement('span');
      icon.className = 'file-icon';
      icon.textContent = 'FILE';
      const details = document.createElement('div');
      const link = document.createElement('a');
      link.href = file.url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = file.originalName;
      item.addEventListener('click', function (event) {
        if (event.target !== link) link.click();
      });
      item.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          link.click();
        }
      });
      const meta = document.createElement('div');
      meta.className = 'file-meta';
      meta.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MiB · ${new Date(file.createdAt).toLocaleDateString()}`;
      details.append(link, meta);
      item.append(icon, details);
      fileList.append(item);
    });
  } catch (error) { showMessage(error.message, true); }
}

async function loadCurrentUser() {
  const response = await fetch('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  const result = await readResponse(response);
  document.getElementById('user-email').textContent = result.user.email;
  isAdmin = result.user.role === 'admin';
  allFilesButton.hidden = !isAdmin;
}

fileInput.addEventListener('change', function () { selectFile(fileInput.files[0]); });
['dragenter', 'dragover'].forEach(function (eventName) {
  dropArea.addEventListener(eventName, function (event) { event.preventDefault(); dropArea.classList.add('is-over'); });
});
['dragleave', 'drop'].forEach(function (eventName) {
  dropArea.addEventListener(eventName, function (event) { event.preventDefault(); dropArea.classList.remove('is-over'); });
});
dropArea.addEventListener('drop', function (event) { selectFile(event.dataTransfer.files[0]); });

document.getElementById('upload-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  if (!fileInput.files[0]) return showMessage('Choose a file first.', true);
  const formData = new FormData();
  formData.append('myFile', fileInput.files[0]);
  showMessage('Uploading to your cloud...');
  try {
    const response = await fetch('/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
    const result = await readResponse(response);
    showMessage(`${result.file.originalName} was uploaded successfully.`);
    fileInput.value = '';
    fileName.textContent = 'No file selected';
    loadFiles();
  } catch (error) { showMessage(error.message, true); }
});

document.getElementById('refresh-files').addEventListener('click', loadFiles);
allFilesButton.addEventListener('click', function () {
  if (!isAdmin) return;
  showingAllFiles = !showingAllFiles;
  filesHeading.textContent = showingAllFiles ? 'All files' : 'My files';
  allFilesButton.textContent = showingAllFiles ? 'My files' : 'All files';
  loadFiles();
});
document.getElementById('logout').addEventListener('click', function () {
  localStorage.removeItem('fileUploadToken');
  window.location.href = '/login';
});
loadCurrentUser().then(loadFiles).catch(function (error) {
  showMessage(error.message, true);
});

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const imageInput = document.getElementById('image-input');
const faceImage = document.getElementById('face-image');
const resultContainer = document.getElementById('result-container');
const uploadArea = document.getElementById('upload-area');
const previewContainer = document.getElementById('preview-container');
const retryBtn = document.getElementById('retry-btn');
const loading = document.getElementById('loading');

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/4i2VICANh/";
let model, maxPredictions;

// Load the model
async function init() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

init();

// Handle Image Upload
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            faceImage.src = e.target.result;
            uploadArea.style.display = 'none';
            previewContainer.style.display = 'block';
            retryBtn.style.display = 'inline-block';
            predict();
        };
        reader.readAsDataURL(file);
    }
});

uploadArea.addEventListener('click', () => imageInput.click());

retryBtn.addEventListener('click', () => {
    uploadArea.style.display = 'block';
    previewContainer.style.display = 'none';
    retryBtn.style.display = 'none';
    imageInput.value = '';
    resultContainer.innerHTML = '';
});

// Predict the animal face
async function predict() {
    loading.style.display = 'block';
    const prediction = await model.predict(faceImage);
    loading.style.display = 'none';
    
    resultContainer.innerHTML = '';
    prediction.sort((a, b) => b.probability - a.probability);

    prediction.forEach(p => {
        const percent = (p.probability * 100).toFixed(1);
        const resultHTML = `
            <div class="result-bar-wrapper">
                <div class="label-text">
                    <span>${p.className}</span>
                    <span>${percent}%</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
        resultContainer.insertAdjacentHTML('beforeend', resultHTML);
    });
}

// Theme logic
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️ Light Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});
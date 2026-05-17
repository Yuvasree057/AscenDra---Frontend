const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'pages/profile/Profile.jsx',
    'pages/onboarding/Onboarding.jsx',
    'pages/auth/Login.jsx',
    'pages/auth/Register.jsx',
    'context/AppContext.jsx',
    'components/SkillSelector.jsx',
    'components/Chatbot.jsx'
];

const basePath = 'c:/ascendra/frontend/src';

filesToUpdate.forEach(file => {
    const fullPath = path.join(basePath, file);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (!content.includes('import { API_BASE_URL }')) {
        const depth = file.split('/').length - 1;
        const relativePrefix = depth === 0 ? './' : '../'.repeat(depth);
        const importStatement = "import { API_BASE_URL } from '" + relativePrefix + "config';\n";
        content = importStatement + content;
    }
    
    content = content.replace(/'http:\/\/localhost:8000\//g, '${API_BASE_URL}/');
    content = content.replace(/http:\/\/localhost:8000\//g, '${API_BASE_URL}/');
    
    fs.writeFileSync(fullPath, content);
    console.log('Updated ' + file);
});

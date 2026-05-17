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
    
    // Fix the broken template literals from the previous script
    content = content.replace(/\$\{API_BASE_URL\}\/api\/skills'\)/g, '/api/skills)');
    content = content.replace(/\$\{API_BASE_URL\}\/api\/profile', \{/g, '/api/profile, {');
    content = content.replace(/\$\{API_BASE_URL\}\/api\/auth\/login', \{/g, '/api/auth/login, {');
    content = content.replace(/\$\{API_BASE_URL\}\/api\/auth\/register', \{/g, '/api/auth/register, {');
    content = content.replace(/\$\{API_BASE_URL\}\/api\/chat', \{/g, '/api/chat, {');
    
    fs.writeFileSync(fullPath, content);
    console.log('Fixed syntax in ' + file);
});

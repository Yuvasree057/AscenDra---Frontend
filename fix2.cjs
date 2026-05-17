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
    
    // Fix broken templates
    content = content.replace(/fetch\(\/api\/skills'\)/g, 'fetch(`${API_BASE_URL}/api/skills`)');
    content = content.replace(/fetch\(\/api\/profile, \{/g, 'fetch(`${API_BASE_URL}/api/profile`, {');
    content = content.replace(/fetch\(\/api\/auth\/login, \{/g, 'fetch(`${API_BASE_URL}/api/auth/login`, {');
    content = content.replace(/fetch\(\/api\/auth\/register, \{/g, 'fetch(`${API_BASE_URL}/api/auth/register`, {');
    content = content.replace(/fetch\(\/api\/chat, \{/g, 'fetch(`${API_BASE_URL}/api/chat`, {');
    // Also fix the initial mistake if it wasn't caught
    content = content.replace(/fetch\(\/api\/skills\)/g, 'fetch(`${API_BASE_URL}/api/skills`)');
    content = content.replace(/fetch\(\/api\/suggest-skills\?skills=\$\{selectedSkills\.join\(\',\',\)\}\`\)/g, 'fetch(`${API_BASE_URL}/api/suggest-skills?skills=${selectedSkills.join(\',\')}`)');

    fs.writeFileSync(fullPath, content);
    console.log('Fixed syntax in ' + file);
});

const fs = require('fs');
const file = 'c:/ascendra/frontend/src/pages/profile/Profile.jsx';
let content = fs.readFileSync(file, 'utf8');

const correctActions = \          <div className="profile-actions flex-center" style={{ gap: '12px' }}>
            {saveSuccess && (
              <span className="p-small text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} color="#10B981" /> Profile updated successfully
              </span>
            )}
            {isEditing ? (
              <div className="flex-center" style={{ gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setIsEditing(false)} disabled={isSaving}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={() => handleSave(formData)} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </header>\;

content = content.replace(/          <div className="profile-actions flex-center"[\s\S]*?<\/header>/, correctActions);
fs.writeFileSync(file, content);
console.log('Fixed profile actions');

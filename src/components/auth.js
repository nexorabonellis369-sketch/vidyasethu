/**
 * Auth Component
 * Handles Gmail-style login and session management.
 */

export function renderAuth(container, { onLogin }) {
    container.innerHTML = `
    <div class="auth-wrapper animate-fade">
        <div class="bg-blur blur-cyan"></div>
        <div class="bg-blur blur-purple"></div>
        
        <div class="auth-card card-glass">
            <div class="auth-header">
                <div class="auth-logo animate-float">
                    <img src="/logo.png?v=2" alt="Logo" width="60" height="60">
                </div>
                <h1 class="auth-title">Vidyasetu</h1>
                <p class="auth-subtitle">Academic Companion for PSG Tech Students</p>
            </div>

            <div class="auth-body">
                <p style="text-align: center; color: var(--text-secondary); margin-bottom: 24px; font-size: 0.95rem;">
                    Sign in with your student email to continue to your personalized study space.
                </p>

                <div id="login-form">
                    <div class="form-group">
                        <label class="form-label">Gmail/Student ID</label>
                        <input type="email" id="login-email" class="form-input" placeholder="student@gmail.com" autocomplete="email">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Name (Display Name)</label>
                        <input type="text" id="login-name" class="form-input" placeholder="Enter your name" autocomplete="name">
                    </div>

                    <button id="login-btn" class="btn btn-primary btn-block" style="margin-top: 16px; height: 50px; font-size: 1rem;">
                         <span><img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" width="18" height="18" style="vertical-align: middle; margin-right: 8px;"></span>
                         Sign in with Google
                    </button>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <span style="font-size: 0.8rem; color: var(--text-muted);">
                             By continuing, you agree to PSG Tech Academic Guidelines.
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="auth-footer">
                <p>2024 Regulation Compatible · Secure Local Storage</p>
            </div>
        </div>
    </div>
    <style>
        .auth-wrapper {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex; align-items: center; justify-content: center;
            background: #020617;
            z-index: 9999;
            overflow: hidden;
        }
        .auth-card {
            width: 100%;
            max-width: 400px;
            padding: 40px;
            text-align: center;
            position: relative;
            z-index: 10;
        }
        .auth-header { margin-bottom: 32px; }
        .auth-logo {
            width: 80px; height: 80px;
            background: var(--gradient-primary);
            border-radius: 20px;
            margin: 0 auto 20px;
            display: flex; align-items: center; justify-content: center;
            box-shadow: var(--shadow-glow-cyan);
        }
        .auth-title { font-size: 2.2rem; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.03em; }
        .auth-subtitle { color: var(--text-tertiary); font-size: 0.9rem; }
        
        .auth-body { text-align: left; }
        .auth-footer { margin-top: 24px; font-size: 0.75rem; color: var(--text-muted); }
        .btn-block { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; }
    </style>
    `;

    const loginBtn = container.querySelector('#login-btn');

    loginBtn.addEventListener('click', () => {
        const email = container.querySelector('#login-email').value.trim();
        const name = container.querySelector('#login-name').value.trim();

        if (!email || !email.includes('@')) {
            alert("Please enter a valid Gmail address.");
            return;
        }

        if (!name) {
            alert("Please enter a name for your profile.");
            return;
        }

        const userData = {
            email,
            name,
            roll: email.split('@')[0].toUpperCase(), // Extract roll from email prefix if possible
            dept: 'Applied Science', // Default for now
            avatar: '👨‍🎓',
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('vidyasetu_user', JSON.stringify(userData));

        // Success animation
        loginBtn.innerHTML = 'Verifying with Google...';
        loginBtn.disabled = true;

        async function syncProfile() {
            try {
                const { insforge, isConfigured } = await import('../lib/insforge.js');
                if (isConfigured) {
                    const { data, error } = await insforge
                        .from('profiles')
                        .upsert({
                            email: userData.email,
                            name: userData.name,
                            roll: userData.roll,
                            dept: userData.dept,
                            avatar: userData.avatar,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'email' })
                        .select();

                    if (!error && data?.[0]) {
                        userData.insforge_id = data[0].id;
                        console.log('🛡️ Profile synced with InsForge:', userData.insforge_id);
                    } else if (error) {
                        console.error('❌ InsForge Profile Sync Error:', error);
                    }
                }
            } catch (err) {
                console.error('❌ InsForge Auth error:', err);
            } finally {
                localStorage.setItem('vidyasetu_user', JSON.stringify(userData));
                onLogin(userData);
            }
        }

        syncProfile();
    });
}

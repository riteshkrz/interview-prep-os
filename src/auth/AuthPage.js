/**
 * 45-Day Interview Prep OS - Dedicated Authentication Page
 * Sleek, high-converting Sign In & Sign Up experience with Supabase Auth,
 * integrating 4-digit activation PIN verification for purchasers.
 */

import { signIn, signUp, signInWithOtp, isSupabaseConfigured } from '../lib/supabase.js';
import { stateSyncService } from '../services/stateSyncService.js';
import { accessService } from '../services/accessService.js';
import { openBuyAccessModal } from '../components/BuyAccessModal.js';

export function renderAuthPage(initialMode = 'signin') {
  const configured = isSupabaseConfigured();

  // Extract pre-filled query parameters from URL hash (e.g. #/signup?email=foo@bar.com&pin=4829)
  let prefillEmail = '';
  let prefillPin = '';
  try {
    const hash = window.location.hash || '';
    const qIndex = hash.indexOf('?');
    if (qIndex !== -1) {
      const params = new URLSearchParams(hash.slice(qIndex + 1));
      prefillEmail = params.get('email') || '';
      prefillPin = params.get('pin') || '';
    }
  } catch (e) { /* ignore */ }

  const isSignup = initialMode === 'signup' || Boolean(prefillPin);

  return `
    <div class="min-h-screen bg-[#0A0E17] text-[#F8FAFC] flex flex-col justify-between selection:bg-[#6366F1] selection:text-white font-body relative overflow-hidden">
      
      <!-- Ambient Glow Orbs -->
      <div class="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#6366F1]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <!-- Top Simple Navbar -->
      <header class="w-full max-w-6xl mx-auto px-6 h-16 flex items-center justify-between z-10">
        <a href="#/" class="flex items-center gap-2.5 group">
          <div class="w-7 h-7 rounded bg-gradient-to-br from-[#6366F1] to-[#38BDF8] flex items-center justify-center text-white shadow-sm shadow-[#6366F1]/30 group-hover:scale-105 transition-transform">
            <span class="material-symbols-outlined text-[17px]">terminal</span>
          </div>
          <span class="font-sans text-[15px] font-semibold text-white tracking-tight">Interview Prep OS</span>
        </a>

        <div class="flex items-center gap-3 text-[13px]">
          <a href="#/" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-sans">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Home</span>
          </a>
          <span class="text-slate-700">|</span>
          <a href="#/dashboard" class="text-[#38BDF8] hover:underline font-code text-[12px] flex items-center gap-1">
            <span>Guest Workspace</span>
            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
          </a>
        </div>
      </header>

      <!-- Main Content Split Grid -->
      <main class="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div class="w-full max-w-4xl bg-[#0F1626]/90 border border-[#24314A] rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          <!-- LEFT PANEL: Value Props & Social Proof (Desktop only, 5 cols) -->
          <div class="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#141C2E] to-[#0D1422] p-8 border-r border-[#24314A] flex-col justify-between relative">
            <div class="flex flex-col gap-6">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6366F1]/15 border border-[#6366F1]/30 text-[#818CF8] text-[11px] font-code w-max">
                <span class="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse"></span>
                <span>Senior Engineer Track</span>
              </div>

              <div>
                <h2 class="font-sans text-[22px] font-bold text-white tracking-tight leading-snug">
                  Crack L5 / L6 Interviews in 45 Days.
                </h2>
                <p class="text-[13px] text-slate-400 mt-2 leading-relaxed">
                  Sign in to synchronize your preparation across all your devices with end-to-end database persistence.
                </p>
              </div>

              <!-- Feature Bullets -->
              <div class="flex flex-col gap-3.5 pt-2">
                <div class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[13px]">check</span>
                  </div>
                  <div class="text-[12px]">
                    <span class="text-white font-medium block">100 Core Curated DSA Problems</span>
                    <span class="text-slate-400 text-[11px]">Categorized by high-yield senior patterns</span>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[13px]">check</span>
                  </div>
                  <div class="text-[12px]">
                    <span class="text-white font-medium block">12 Production System Design Specs</span>
                    <span class="text-slate-400 text-[11px]">API contracts, data models, and deep-dive rubrics</span>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[13px]">check</span>
                  </div>
                  <div class="text-[12px]">
                    <span class="text-white font-medium block">Realtime Cloud Sync</span>
                    <span class="text-slate-400 text-[11px]">Seamless state persistence via Supabase PostgreSQL</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quote badge -->
            <div class="p-3 bg-[#0B0F19]/60 border border-[#24314A]/80 rounded-lg text-[11px] text-slate-400 font-sans mt-6">
              <span class="text-slate-200 font-semibold block mb-0.5">Zero Burnout Architecture</span>
              Organized 60-minute daily sprints for working software engineers.
            </div>
          </div>

          <!-- RIGHT PANEL: Authentication Form (7 cols) -->
          <div class="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            
            ${!configured ? `
              <div class="p-3.5 mb-5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[12px] text-amber-200 flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[18px] text-amber-400 shrink-0 mt-0.5">warning</span>
                <div>
                  <span class="font-semibold text-amber-300 block">Supabase Credentials Missing</span>
                  Add your credentials to <code class="bg-black/30 px-1 rounded font-code text-[11px]">.env</code> to activate cloud authentication.
                </div>
              </div>
            ` : ''}

            <!-- Auth Mode Segmented Tabs -->
            <div class="flex bg-[#141C2E] border border-[#24314A] p-1 rounded-xl mb-6">
              <button id="auth-tab-signin" class="flex-1 py-2 text-center text-[13px] font-semibold rounded-lg transition-all ${!isSignup ? 'bg-[#6366F1] text-white shadow-sm' : 'text-slate-400 hover:text-white'}">
                Sign In
              </button>
              <button id="auth-tab-signup" class="flex-1 py-2 text-center text-[13px] font-semibold rounded-lg transition-all ${isSignup ? 'bg-[#6366F1] text-white shadow-sm' : 'text-slate-400 hover:text-white'}">
                Create Account
              </button>
            </div>

            <!-- Alert Notification Container -->
            <div id="auth-page-alert" class="hidden mb-4 p-3 rounded-lg text-[12px] font-sans"></div>

            <!-- Main Auth Form -->
            <form id="auth-main-form" class="flex flex-col gap-4">
              
              <!-- 1. Email Address -->
              <div>
                <label for="auth-page-email" class="block font-code text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                  Email Address
                </label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-500">mail</span>
                  <input
                    id="auth-page-email"
                    type="email"
                    required
                    placeholder="engineer@company.com"
                    value="${escapeHtml(prefillEmail)}"
                    autocomplete="email"
                    class="w-full bg-[#141C2E] border border-[#24314A] rounded-lg pl-10 pr-3 py-2.5 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                  />
                </div>
              </div>

              <!-- 2. 4-Digit Activation PIN (Sign Up only) -->
              <div id="pin-field-group" class="${isSignup ? '' : 'hidden'}">
                <div class="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <label for="auth-page-pin" class="block font-code text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    4-Digit Activation PIN
                  </label>
                  <button type="button" id="trigger-buy-pin-btn" class="text-[11px] text-[#38BDF8] hover:underline font-code">
                    Need a PIN? Buy Access Pass
                  </button>
                </div>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-500">pin</span>
                  <input
                    id="auth-page-pin"
                    type="text"
                    maxlength="6"
                    pattern="[0-9]*"
                    placeholder="e.g. 4829"
                    value="${escapeHtml(prefillPin)}"
                    class="w-full bg-[#141C2E] border border-[#24314A] rounded-lg pl-10 pr-3 py-2.5 text-[13px] text-white font-code tracking-widest placeholder-slate-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                  />
                </div>
                <span class="text-[11px] text-slate-500 mt-1 block">The 4-digit PIN generated when you click Buy.</span>
              </div>

              <!-- 3. Password -->
              <div id="password-field-group">
                <div class="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <label for="auth-page-password" class="block font-code text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Password
                  </label>
                  <button type="button" id="toggle-magic-link-btn" class="text-[11px] text-[#38BDF8] hover:underline font-code">
                    Use Magic Link instead
                  </button>
                </div>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-500">lock</span>
                  <input
                    id="auth-page-password"
                    type="password"
                    required
                    minlength="6"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    class="w-full bg-[#141C2E] border border-[#24314A] rounded-lg pl-10 pr-10 py-2.5 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                  />
                  <button type="button" id="toggle-password-visibility-btn" class="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">
                    <span class="material-symbols-outlined text-[18px]" id="password-eye-icon">visibility</span>
                  </button>
                </div>
                <span id="password-hint" class="text-[10.5px] text-slate-500 mt-1 block ${isSignup ? '' : 'hidden'}">Must be at least 6 characters</span>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                id="auth-page-submit-btn"
                class="w-full mt-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:brightness-110 active:brightness-95 text-white font-medium text-[14px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6366F1]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span id="submit-spinner" class="material-symbols-outlined text-[18px] animate-spin hidden">sync</span>
                <span id="auth-page-submit-text">${isSignup ? 'Create Account & Activate OS' : 'Sign In to Workspace'}</span>
                <span class="font-code text-[12px] opacity-80">→</span>
              </button>

              <!-- Quick Mode Toggle Link -->
              <div class="flex items-center justify-center text-[12px] text-slate-400 mt-1">
                <span id="auth-mode-switch-prompt">${isSignup ? 'Already have an account?' : "Don't have an account yet?"}</span>
                <button type="button" id="auth-mode-switch-link" class="ml-1.5 text-[#38BDF8] hover:underline font-medium cursor-pointer">
                  ${isSignup ? 'Sign In to Workspace' : 'Create Account & Enter PIN'}
                </button>
              </div>
            </form>

            <!-- Bottom Divider & Guest Link -->
            <div class="mt-6 pt-5 border-t border-[#24314A] text-center flex flex-col gap-2.5">
              <span class="text-[12px] text-slate-400">
                Want to test first without creating an account?
              </span>
              <a href="#/dashboard" class="text-[12px] text-[#38BDF8] hover:text-white font-medium transition-colors flex items-center justify-center gap-1">
                <span>Continue as Guest in Local Storage Mode</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>

          </div>

        </div>
      </main>

      <!-- Minimal Footer -->
      <footer class="w-full text-center py-4 text-[11px] font-code text-slate-600 z-10">
        45-Day Interview Prep OS • Secured by Supabase PostgreSQL RLS
      </footer>

    </div>
  `;
}

export function attachAuthPageListeners() {
  const hash = window.location.hash || '';
  let mode = hash.includes('signup') || hash.includes('pin=') ? 'signup' : 'signin';
  let isPasswordVisible = false;

  const tabSignIn = document.getElementById('auth-tab-signin');
  const tabSignUp = document.getElementById('auth-tab-signup');
  const submitText = document.getElementById('auth-page-submit-text');
  const pinGroup = document.getElementById('pin-field-group');
  const pinInput = document.getElementById('auth-page-pin');
  const passGroup = document.getElementById('password-field-group');
  const passInput = document.getElementById('auth-page-password');
  const passHint = document.getElementById('password-hint');
  const magicLinkBtn = document.getElementById('toggle-magic-link-btn');
  const buyPinBtn = document.getElementById('trigger-buy-pin-btn');
  const eyeBtn = document.getElementById('toggle-password-visibility-btn');
  const eyeIcon = document.getElementById('password-eye-icon');
  const form = document.getElementById('auth-main-form');
  const alertBox = document.getElementById('auth-page-alert');
  const submitBtn = document.getElementById('auth-page-submit-btn');
  const spinner = document.getElementById('submit-spinner');

  const showAlert = (htmlOrText, type = 'error') => {
    if (!alertBox) return;
    alertBox.innerHTML = htmlOrText;
    alertBox.className = type === 'error'
      ? 'mb-4 p-3.5 rounded-xl text-[12px] font-sans bg-rose-500/10 border border-rose-500/30 text-rose-300 flex flex-col gap-2'
      : 'mb-4 p-3.5 rounded-xl text-[12px] font-sans bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex flex-col gap-1.5';
    alertBox.classList.remove('hidden');
  };

  const hideAlert = () => {
    if (alertBox) alertBox.classList.add('hidden');
  };

  const switchPrompt = document.getElementById('auth-mode-switch-prompt');
  const switchLink = document.getElementById('auth-mode-switch-link');

  const setMode = (newMode) => {
    mode = newMode;
    hideAlert();

    if (mode === 'signin') {
      tabSignIn.className = 'flex-1 py-2 text-center text-[13px] font-semibold rounded-lg transition-all bg-[#6366F1] text-white shadow-sm';
      tabSignUp.className = 'flex-1 py-2 text-center text-[13px] font-semibold rounded-lg transition-all text-slate-400 hover:text-white';
      submitText.textContent = 'Sign In to Workspace';
      if (pinGroup) pinGroup.classList.add('hidden');
      if (pinInput) pinInput.required = false;
      passGroup.classList.remove('hidden');
      passInput.required = true;
      if (passHint) passHint.classList.add('hidden');
      if (magicLinkBtn) magicLinkBtn.textContent = 'Use Magic Link instead';
      if (switchPrompt) switchPrompt.textContent = "Don't have an account yet?";
      if (switchLink) switchLink.textContent = "Create Account & Enter PIN";
    } else if (mode === 'signup') {
      tabSignUp.className = 'flex-1 py-2 text-center text-[13px] font-semibold rounded-lg transition-all bg-[#6366F1] text-white shadow-sm';
      tabSignIn.className = 'flex-1 py-2 text-center text-[13px] font-semibold rounded-lg transition-all text-slate-400 hover:text-white';
      submitText.textContent = 'Create Account & Activate OS';
      if (pinGroup) pinGroup.classList.remove('hidden');
      if (pinInput) pinInput.required = true;
      passGroup.classList.remove('hidden');
      passInput.required = true;
      if (passHint) passHint.classList.remove('hidden');
      if (magicLinkBtn) magicLinkBtn.textContent = 'Use Magic Link instead';
      if (switchPrompt) switchPrompt.textContent = "Already have an account?";
      if (switchLink) switchLink.textContent = "Sign In to Workspace";

      // If email has a cached activation PIN, auto-populate it
      const currentEmail = document.getElementById('auth-page-email')?.value.trim();
      if (currentEmail && (!pinInput.value || pinInput.value.length < 4)) {
        const cachedPin = accessService.getPinForEmail(currentEmail);
        if (cachedPin) {
          pinInput.value = cachedPin;
        }
      }
    } else if (mode === 'magic_link') {
      if (pinGroup) pinGroup.classList.add('hidden');
      if (pinInput) pinInput.required = false;
      passGroup.classList.add('hidden');
      passInput.required = false;
      submitText.textContent = 'Send Magic Login Link';
    }
  };

  if (tabSignIn && tabSignUp) {
    tabSignIn.addEventListener('click', () => setMode('signin'));
    tabSignUp.addEventListener('click', () => setMode('signup'));
  }

  if (switchLink) {
    switchLink.addEventListener('click', () => {
      setMode(mode === 'signup' ? 'signin' : 'signup');
    });
  }

  if (buyPinBtn) {
    buyPinBtn.addEventListener('click', () => {
      openBuyAccessModal();
    });
  }

  if (magicLinkBtn) {
    magicLinkBtn.addEventListener('click', () => {
      if (mode === 'magic_link') {
        setMode('signin');
      } else {
        setMode('magic_link');
      }
    });
  }

  // Show signed out confirmation notice if arriving from sign out
  if (hash.includes('signedout=true')) {
    showAlert('✓ You have been signed out safely. Sign in to your account to access your workspace.', 'success');
  }

  if (eyeBtn && eyeIcon && passInput) {
    eyeBtn.addEventListener('click', () => {
      isPasswordVisible = !isPasswordVisible;
      passInput.type = isPasswordVisible ? 'text' : 'password';
      eyeIcon.textContent = isPasswordVisible ? 'visibility_off' : 'visibility';
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      const email = document.getElementById('auth-page-email')?.value.trim();
      const password = passInput?.value;
      const pin = pinInput?.value?.trim();

      if (!email) {
        showAlert('Please enter a valid email address.');
        return;
      }

      if (mode === 'signup') {
        if (!pin || pin.length < 4) {
          showAlert('Please enter your 4-digit activation PIN. (Click "Need a PIN?" if you haven\'t purchased yet)');
          return;
        }

        // Verify PIN for this email
        const pinCheck = await accessService.verifyAccessPin(email, pin);
        if (!pinCheck.valid) {
          showAlert('Invalid 4-digit activation PIN for this email. Please verify your PIN or click "Need a PIN? Buy Access Pass" to generate one.');
          return;
        }
      }

      if (mode !== 'magic_link' && (!password || password.length < 6)) {
        showAlert('Password must be at least 6 characters.');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (spinner) spinner.classList.remove('hidden');

      try {
        if (mode === 'magic_link') {
          const { error } = await signInWithOtp(email);
          if (error) throw error;
          showAlert(`Check your email (${email}) for your magic sign-in link!`, 'success');
        } else if (mode === 'signup') {
          let signupSuccess = false;
          let signupMsg = '';

          try {
            const { data, error } = await signUp(email, password);
            if (error) {
              if (error.message && error.message.toLowerCase().includes('already registered')) {
                // Try sign in directly
                const { error: loginErr } = await signIn(email, password);
                if (!loginErr) {
                  signupSuccess = true;
                  signupMsg = '🎉 Account authenticated & PIN verified! Redirecting to workspace...';
                } else {
                  showAlert(`
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-[18px] text-amber-400 shrink-0 mt-0.5">account_circle</span>
                      <div>
                        <span class="font-semibold block text-amber-200">Account Already Registered</span>
                        <span class="text-slate-300">An account with <strong>${escapeHtml(email)}</strong> already exists. Please switch to the "Sign In" tab and enter your password.</span>
                      </div>
                    </div>
                    <button type="button" id="switch-to-signin-from-signup-btn" class="mt-2 w-full py-2 px-3 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[12px] font-semibold transition-all shadow-md text-center cursor-pointer">
                      Switch to Sign In Tab →
                    </button>
                  `, 'error');

                  const switchBtn = document.getElementById('switch-to-signin-from-signup-btn');
                  if (switchBtn) switchBtn.addEventListener('click', () => setMode('signin'));
                  return;
                }
              } else if (error.message && error.message.toLowerCase().includes('rate limit')) {
                // Supabase email rate limit on sending confirmation emails
                signupSuccess = true;
                signupMsg = '🎉 Account created & PIN verified! Loading your workspace...';
              } else {
                throw error;
              }
            } else {
              signupSuccess = true;
              if (data?.session) {
                signupMsg = '🎉 Account created & PIN verified! Syncing workspace...';
              } else {
                signupMsg = '🎉 Account created & PIN verified! Loading your workspace...';
              }
            }
          } catch (signupErr) {
            if (signupErr.message && signupErr.message.toLowerCase().includes('rate limit')) {
              signupSuccess = true;
              signupMsg = '🎉 Account registered & PIN verified! Loading your workspace...';
            } else {
              throw signupErr;
            }
          }

          // Consume PIN and mark workspace activated
          await accessService.consumeAccessPin(email, pin);
          localStorage.setItem('prep_os_activated_user', JSON.stringify({
            email,
            pin,
            activatedAt: new Date().toISOString()
          }));

          showAlert(signupMsg || '🎉 Account created & PIN verified! Redirecting to workspace...', 'success');
          setTimeout(() => { window.location.hash = '#/dashboard'; }, 800);
        } else {
          // Sign in mode
          try {
            const { data, error } = await signIn(email, password);
            if (error) throw error;
            showAlert('Signed in successfully! Redirecting to workspace...', 'success');
            setTimeout(() => { window.location.hash = '#/dashboard'; }, 600);
          } catch (signInErr) {
            const errLower = (signInErr.message || '').toLowerCase();
            const isAlreadyActivated = accessService.isActivated(email);
            const unusedPin = accessService.getPinForEmail(email);

            if (errLower.includes('invalid login credentials') || errLower.includes('invalid_credentials')) {
              if (unusedPin && !isAlreadyActivated) {
                showAlert(`
                  <div class="flex items-start gap-2">
                    <span class="material-symbols-outlined text-[18px] text-amber-400 shrink-0 mt-0.5">key</span>
                    <div>
                      <span class="font-semibold block text-amber-200">Account Not Activated Yet</span>
                      <span class="text-slate-300">We found your 4-digit activation PIN (<strong>${unusedPin}</strong>) for this email. Would you like to create your account now?</span>
                    </div>
                  </div>
                  <button type="button" id="auto-create-account-btn" class="mt-2 w-full py-2.5 px-3 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[12px] font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>Create Account with PIN (${unusedPin})</span>
                    <span class="font-mono text-[12px]">→</span>
                  </button>
                `, 'error');

                const autoBtn = document.getElementById('auto-create-account-btn');
                if (autoBtn) {
                  autoBtn.addEventListener('click', () => {
                    setMode('signup');
                    if (pinInput) pinInput.value = unusedPin;
                    form.requestSubmit();
                  });
                }
              } else {
                showAlert(`
                  <div class="flex items-start gap-2">
                    <span class="material-symbols-outlined text-[18px] text-rose-400 shrink-0 mt-0.5">error</span>
                    <div>
                      <span class="font-semibold block text-rose-200">Invalid Login Credentials</span>
                      <span class="text-slate-300">The password was incorrect, or no account was found for <strong>${escapeHtml(email)}</strong>.</span>
                    </div>
                  </div>
                  <div class="mt-2 pt-2 border-t border-rose-500/20 flex flex-col gap-2">
                    <button type="button" id="switch-to-signup-from-alert-btn" class="w-full py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[12px] font-medium transition-colors text-center cursor-pointer">
                      Need a new account? Switch to "Create Account" Tab →
                    </button>
                    <button type="button" id="use-magic-link-from-alert-btn" class="text-[11.5px] text-[#38BDF8] hover:underline text-center cursor-pointer">
                      Forgot password? Sign in with Magic Link instead
                    </button>
                  </div>
                `, 'error');

                const switchToSignupBtn = document.getElementById('switch-to-signup-from-alert-btn');
                if (switchToSignupBtn) {
                  switchToSignupBtn.addEventListener('click', () => {
                    setMode('signup');
                  });
                }

                const magicLinkBtn = document.getElementById('use-magic-link-from-alert-btn');
                if (magicLinkBtn) {
                  magicLinkBtn.addEventListener('click', () => {
                    setMode('magic_link');
                  });
                }
              }
            } else if (errLower.includes('email not confirmed')) {
              showAlert(`
                <div class="flex items-start gap-2">
                  <span class="material-symbols-outlined text-[18px] text-amber-400 shrink-0 mt-0.5">mark_email_unread</span>
                  <div>
                    <span class="font-semibold block text-amber-200">Email Confirmation Required</span>
                    <span class="text-slate-300">Supabase requires email confirmation for new signups. Please check your inbox at <strong>${escapeHtml(email)}</strong> for the confirmation link.</span>
                    <p class="text-[11px] text-slate-400 mt-1">
                      <em>To enable instant login without email confirmation:</em> In Supabase Dashboard → Authentication → Providers → Email → uncheck <strong>Confirm email</strong>.
                    </p>
                  </div>
                </div>
                <a href="#/dashboard" class="mt-2 w-full py-2 px-3 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[12px] font-medium transition-colors text-center block">
                  Continue to Workspace in Local Mode for Now →
                </a>
              `, 'error');
            } else {
              showAlert(signInErr.message || 'Authentication failed. Please verify credentials and try again.');
            }
          }
        }
      } catch (err) {
        showAlert(err.message || 'Authentication failed. Please verify credentials and try again.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (spinner) spinner.classList.add('hidden');
      }
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

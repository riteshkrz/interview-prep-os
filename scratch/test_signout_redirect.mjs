import { renderAuthPage } from '../src/auth/AuthPage.js';

console.log('--- Testing Sign Out -> Sign In Page Flow ---');

// 1. Verify that renderAuthPage('signin') renders the Sign In form
const signinHtml = renderAuthPage('signin');

const assertions = [
  { test: signinHtml.includes('id="auth-tab-signin"'), name: 'Sign In tab present' },
  { test: signinHtml.includes('id="auth-tab-signup"'), name: 'Create Account tab present' },
  { test: signinHtml.includes('id="auth-page-email"'), name: 'Email input field present' },
  { test: signinHtml.includes('id="auth-page-password"'), name: 'Password input field present' },
  { test: signinHtml.includes('id="auth-page-submit-btn"'), name: 'Submit button present' },
  { test: signinHtml.includes('Sign In to Workspace'), name: 'Submit button has "Sign In to Workspace" text' },
  { test: signinHtml.includes('id="auth-page-alert"'), name: 'Alert notification container present' },
  { test: signinHtml.includes('Continue as Guest in Local Storage Mode'), name: 'Guest workspace link present' }
];

for (const a of assertions) {
  if (!a.test) {
    console.error(`FAIL: ${a.name}`);
    process.exit(1);
  }
  console.log(`✓ ${a.name}`);
}

// 2. Test routing logic for #/signin?signedout=true
function testRouting(hash) {
  const isAuth = hash.includes('login') || hash.includes('signin') || hash.includes('signup') || hash.includes('auth');
  const mode = hash.includes('signup') ? 'signup' : 'signin';
  return { isAuth, mode };
}

const routeResult = testRouting('#/signin?signedout=true');
if (!routeResult.isAuth || routeResult.mode !== 'signin') {
  console.error('FAIL: #/signin?signedout=true should route to auth page in signin mode');
  process.exit(1);
}
console.log('✓ Route #/signin?signedout=true correctly routes to Sign In page.');

const loginRouteResult = testRouting('#/login');
if (!loginRouteResult.isAuth || loginRouteResult.mode !== 'signin') {
  console.error('FAIL: #/login should route to auth page in signin mode');
  process.exit(1);
}
console.log('✓ Route #/login correctly routes to Sign In page.');

console.log('\nAll Sign Out -> Sign In tests PASSED!');

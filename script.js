const USE_PROXY = true;
const PROXY  = 'https://cors-anywhere.herokuapp.com/'; // <= değişti
const REQRES = 'https://reqres.in';

const REGISTER_URL = (USE_PROXY ? PROXY : '') + `${REQRES}/api/register`;
const LOGIN_URL    = (USE_PROXY ? PROXY : '') + `${REQRES}/api/login`;

console.log('REGISTER_URL =', REGISTER_URL);
console.log('LOGIN_URL    =', LOGIN_URL);


//SIGNUP 
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  if (!form) return; // Bu sayfa değil

  const email  = document.getElementById('email');     // sadece email + password şart
  const pass   = document.getElementById('password');
  const msgBox = document.getElementById('signupMsg');
  const btn    = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
  e.preventDefault();
  e.stopPropagation(); 
  const eMail = email.value.trim().toLowerCase();
  const p = pass.value;

  try {
    const res = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
  
},

      body: JSON.stringify({ email: eMail, password: p })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      show('Kayıt başarılı', true);
      // setTimeout(()=>location.href='login.html',800)
    } else {
      show(`Kayıt başarısız${data.error ? `: ${data.error}` : ''}`, false);
      console.warn('[signup] status:', res.status, data);
    }
  } catch (err) {
    show('Kayıt başarısız: Ağ hatası.', false);
    console.error(err);
  }
  return false; 
});

  function show(text, ok) {
    msgBox.textContent = text;
    msgBox.classList.remove('d-none', 'alert-success', 'alert-danger');
    msgBox.classList.add('alert', ok ? 'alert-success' : 'alert-danger');
  }
  function setLoading(v, button, originalText) {
    if (!button) return;
    button.disabled = v;
    if (v) button.textContent = 'Kaydediliyor...';
    else   button.textContent = originalText;
  }
});


// LOGIN 
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const email  = document.getElementById('loginEmail') || form.querySelector('input[type="email"]');
  const pass   = document.getElementById('loginPassword') || form.querySelector('input[type="password"]');
  const msgBox = document.getElementById('loginMsg');
  const btn    = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const eMail = (email?.value || '').trim().toLowerCase();
    const p     = pass?.value || '';

    if (!eMail || !p) {
      return show('Kullanıcı adı veya şifre hatalı', false);
    }

    try {
      setLoading(true, btn, 'Log In');

      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'

},

        body: JSON.stringify({ email: eMail, password: p })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.token) {
        // GÖREV: sadece token'ı sakla
        localStorage.setItem('authToken', data.token);
        show('Giriş başarılı ✅ yönlendiriliyor...', true);
        setTimeout(() => (location.href = 'weather.html'), 500);
      } else {
        show('Kullanıcı adı veya şifre hatalı', false);
        console.warn('[login] error:', res.status, data);
      }
    } catch (err) {
      console.error(err);
      show('Kullanıcı adı veya şifre hatalı', false);
    } finally {
      setLoading(false, btn, 'Log In');
    }
  });

  function show(text, ok) {
    if (!msgBox) return alert(text);
    msgBox.textContent = text;
    msgBox.classList.remove('d-none', 'alert-success', 'alert-danger');
    msgBox.classList.add('alert', ok ? 'alert-success' : 'alert-danger');
  }
  function setLoading(v, button, originalText) {
    if (!button) return;
    button.disabled = v;
    if (v) button.textContent = 'Giriş yapılıyor...';
    else   button.textContent = originalText;
  }
});


// ======================= WEATHER (guard + logout) =======================
document.addEventListener('DOMContentLoaded', () => {
  const page = document.getElementById('weatherPage');
  if (!page) return;

  const token = localStorage.getItem('authToken');
  if (!token) {
    location.href = 'login.html';
    return;
  }

  // (opsiyonel) logout butonu
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    location.href = 'login.html';
  });

  // OpenWeather API çağrısını sonraki adımda ekleriz.
});

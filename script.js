
console.log('[boot] script.js yüklendi');
//SIGNUP 
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  if (!form) return; // Bu sayfa değil

  const email = document.getElementById('email');
  const pass = document.getElementById('password');
  const msgBox = document.getElementById('signupMsg');
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); //URL’e query eklemeyi durdurdu

    const eMail = email.value.trim().toLowerCase();
    const p = pass.value;

    if (!eMail || !p) {
      return show('Kayıt başarısız: Email ve şifre zorunlu.', false);
    }

    try {

      setLoading(true, btn, 'Sign Up');

      const res = await fetch('https://reqres.in/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': 'reqres-free-v1'

        },

        body: JSON.stringify({ email: eMail, password: p })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        show('Kayıt başarılı', true);
        setTimeout(() => location.href = 'login.html', 800)

      } else {
        show(`Kayıt başarısız${data.error ? `: ${data.error}` : ''}`, false);
        console.warn('[signup] error:', res.status, data);
      }
    } catch (err) {
      console.error(err);
      show('Kayıt başarısız: Ağ hatası.', false);
    } finally {
      setLoading(false, btn, 'Sign Up');
    }
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
    else button.textContent = originalText;
  }
});


// LOGIN 
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  // sayfa açılır açılmaz önceki oturumu sıfırla
  localStorage.removeItem('authToken');
  localStorage.setItem('authOk', 'false');

  const email = document.getElementById('email');
  const pass = document.getElementById('password');
  const msg = document.getElementById('loginMsg');
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); e.stopPropagation();

    const emailVal = (email?.value || '').trim().toLowerCase();
    const passVal = pass?.value || '';
    if (!emailVal || !passVal) return show('Kullanıcı adı veya şifre hatalı', false);

    try {
      setLoading(true);

      // 1) Normal reqres isteği
      const res = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 'Accept': 'application/json',
          'x-api-key': 'reqres-free-v1'
        },
        body: JSON.stringify({ email: emailVal, password: passVal })
      });

      const raw = await res.text();
      let data = {}; try { data = raw ? JSON.parse(raw) : {}; } catch { }

      const okFromApi = res.status === 200 && typeof data.token === 'string' && data.token.length > 0;

      // 2) Başarılıysa normal akış
      if (okFromApi) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authOk', 'true');
        show('Giriş başarılı ✅ yönlendiriliyor...', true);
        setTimeout(() => location.replace('weather.html'), 500);
        return;
      }

      // 3) 401 (ağ/proxy engeli) ise: DEMO kombinasyonu için fallback
      // if (res.status === 401) {
      //   const okDemo = (emailVal === 'eve.holt@reqres.in' && passVal === 'cityslicka');
      //   if (okDemo) {
      //     localStorage.setItem('authToken', 'local-demo-token');
      //     localStorage.setItem('authOk', 'true');
      //     show('Giriş başarılı ✅ yönlendiriliyor...', true);
      //     setTimeout(() => location.replace('weather.html'), 500);
      //     return;
      //   }
      // }

      // 4) Diğer tüm durumlar: başarısız
      localStorage.removeItem('authToken');
      localStorage.setItem('authOk', 'false');
      show('Kullanıcı adı veya şifre hatalı', false);

    } catch (err) {
      console.error(err);
      localStorage.removeItem('authToken');
      localStorage.setItem('authOk', 'false');
      show('Kullanıcı adı veya şifre hatalı', false);
    } finally {
      setLoading(false);
    }
  });

  function setLoading(v) {
    if (!btn) return;
    btn.disabled = v;
    btn.textContent = v ? 'Giriş yapılıyor...' : 'Log In';
  }
  function show(text, ok) {
    if (!msg) return alert(text);
    msg.textContent = text;
    msg.classList.remove('d-none', 'alert-success', 'alert-danger');
    msg.classList.add('alert', ok ? 'alert-success' : 'alert-danger');
  }
});



// ======================= WEATHER =======================
document.addEventListener('DOMContentLoaded', () => {
  const onWeatherPage =
    document.getElementById('weatherPage') ||
    /\/weather\.html($|[?#])/.test(location.pathname);


     console.log('[weather] init?', !!onWeatherPage);
  if (!onWeatherPage) return;

console.log('[weather] guard ok =',
    localStorage.getItem('authOk'),
    'token?', !!localStorage.getItem('authToken')
  );
    
  const ok    = localStorage.getItem('authOk') === 'true';
  const token = localStorage.getItem('authToken');
  if (!ok || !token) {
    localStorage.removeItem('authToken');
    localStorage.setItem('authOk','false');
    location.replace('login.html');
    return;
  }

  const API_KEY = 'abf0d9af9f6af4292623cfcbd84efe60'.trim();;
  const input = document.getElementById('cityInput');
  const btn   = document.getElementById('getWeatherBtn');
  const msg   = document.getElementById('weatherMsg');
  const card  = document.getElementById('weatherCard');
  const body  = document.getElementById('weatherBody');

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.setItem('authOk','false');
    location.replace('login.html');
  });

  function setLoading(v){ btn.disabled=v; btn.textContent = v ? 'Yükleniyor...' : 'Get Weather'; }
  function showMsg(text, type='danger'){
    msg.textContent = text;
    msg.classList.remove('d-none','alert-success','alert-danger');
    msg.classList.add('alert',`alert-${type}`);
  }
  function clearMsg(){ msg.classList.add('d-none'); }

  async function fetchWeather(){
    const city = (input.value || '').trim();
    if (!city){ showMsg('Lütfen şehir girin.'); input.focus(); return; }

    clearMsg(); setLoading(true); card.classList.add('d-none');

    try{
      const url =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=${encodeURIComponent(city)}` +
      `&appid=${API_KEY}` +
      `&units=metric&lang=tr`;
      
      const res  = await fetch(url);
      const text = await res.text();
      console.log('[weather] status:', res.status, 'raw:', text);

      let data = {}; try { data = text ? JSON.parse(text) : {}; } catch {
        showMsg('OpenWeather beklenmeyen yanıt döndü (JSON parse).'); return;
      }

      if (!res.ok){
        if (res.status === 401) return showMsg('API anahtarı geçersiz veya eksik (401).');
        if (res.status === 404) return showMsg('Şehir bulunamadı (404).');
        if (res.status === 429) return showMsg('Limit aşıldı (429). Biraz sonra tekrar deneyin.');
        return showMsg(data?.message ? `Hata: ${data.message}` : 'İstek başarısız.');
      }

      const name = data.name;
      const temp = Math.round(data.main?.temp);
      const desc = (data.weather?.[0]?.description || '').toString();
      const icon = data.weather?.[0]?.icon;

      body.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          ${icon ? `<img width="80" height="80" alt="${desc}" src="https://openweathermap.org/img/wn/${icon}@2x.png" />` : ''}
          <div>
            <h4 class="mb-1">${name}</h4>
            <div class="fs-2 fw-semibold">${temp}°C</div>
            <div class="text-capitalize">${desc}</div>
          </div>
        </div>
      `;
      card.classList.remove('d-none');
    }catch(err){
      console.error(err);
      showMsg('Ağ hatası. Lütfen tekrar deneyin.');
    }finally{
      setLoading(false);
    }
  }

  btn.addEventListener('click', fetchWeather);
  console.log('[weather] click', 'city=', input.value);
  input.addEventListener('keydown', (e)=>{ if (e.key === 'Enter'){
     e.preventDefault(); 
     fetchWeather(); 
    } });

  // İstersen başlangıç için:
  // input.value = 'Istanbul';
});








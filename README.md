🌤️ Login-Weather App
<img src="logo.png" alt="Proje Logosu" width="120"/>

Bu proje JavaScript, HTML ve CSS ile geliştirilmiş basit bir kayıt → giriş → hava durumu uygulamasıdır.
Kullanıcı önce kayıt olur, giriş yapar, ardından şehir yazarak OpenWeather üzerinden anlık hava durumunu görüntüler. Giriş sonrası token localStorage’da saklanır; Log out ile temizlenir.

🚀 Canlı Demo

👉 [Projeyi buradan çalıştır](https://busraygul.github.io/weather-app/)

⚙️ Özellikler

Sign Up: POST https://reqres.in/api/register
– Başarılı/başarısız uyarıları

Log In: POST https://reqres.in/api/login
– Başarılı yanıtla dönen token localStorage’a yazılır (authToken + authOk='true')

Guard: weather.html yalnızca giriş sonrası erişilebilir

Hava durumu: OpenWeather’dan şehir adına göre sıcaklık (°C), açıklama, ikon

Log out: Token temizlenir ve login sayfasına yönlendirilir

Responsive sade arayüz (Bootstrap 5 + minimal CSS)

🛠️ Kullanılan Teknolojiler

HTML5

CSS3

Bootstrap 5

JavaScript (ES6+)

Reqres

Uygulama Görselleri
![Log In](login.png)
![Weather Form](weather.png)
![Sign Up](signup.png)
![Weather Result](showWeather.png)



▶️ Kullanım

Sign Up: Email + password ile kayıt ol (başarı/hatayı görürsün).

Log In: Email + password ile giriş yap; başarılıysa weather.html’e yönlendirilirsin.

Weather: Şehir adını gir → Get Weather → sıcaklık, açıklama, ikon gösterilir.

Log out: Sağ üst → token temizlenir → login sayfasına dönersin.

👩‍💻 Geliştirici

[GitHub Profilim](https://github.com/busraygul)

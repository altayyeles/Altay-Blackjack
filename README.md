
# Blackjack Oyunu 🃏

Vanilla HTML, CSS ve JavaScript ile geliştirilmiş klasik bir Blackjack (21) kart oyunu. Akıcı animasyonlar, ses efektleri ve casino temalı bir arayüz içerir.

## 🎮 Özellikler

- **Tam Blackjack oynanışı** – Kart çek, bekle ve otomatik krupiye oynanışı
- **Ses efektleri** – Kart dağıtma, karıştırma, kazanma ve kaybetme sesleri
- **Akıcı animasyonlar** – Kartlar gerçekçi zamanlamayla dağıtılır
- **Ses Aç/Kapat** – Tek tıkla ses efektlerini kontrol et
- **Duyarlı tasarım** – Masaüstü ve mobil cihazlarda çalışır
- **Casino temalı arayüz** – Klasik kart stiliyle yeşil masa

## 🚀 Başlarken

### Çevrimiçi Oyna
`blackjack.html` dosyasını web tarayıcınızda açarak hemen oynayabilirsiniz!

### Yerel Geliştirme
1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/YOUR_USERNAME/blackjack-game.git
   cd blackjack-game
   ```

2. `blackjack.html` dosyasını tarayıcıda açın:
   ```bash
   open blackjack.html  # macOS
   # veya
   start blackjack.html # Windows
   # veya
   xdg-open blackjack.html # Linux
   ```

## 📖 Nasıl Oynanır

1. **"Yeni Oyun"** butonuna tıklayın
2. Siz ve krupiye ikişer kart alırsınız
3. Amacınız, 21’e mümkün olduğunca yaklaşmak (aşmadan)
4. Kart değerleri:
   - Sayı kartları: Kartın üzerindeki değer (2-10)
   - Resimli kartlar (J, Q, K): 10 puan
   - As: 1 veya 11 puan (otomatik hesaplanır)
5. Seçenekleriniz:
   - **Kart Çek (Hit)**: Bir kart daha al
   - **Bekle (Stand)**: Elini koru
6. Krupiye 16 veya altı puanda kart çeker, 17 veya üstünde bekler
7. Kazanma koşulları:
   - İlk iki kartta 21 (Blackjack) yapmak
   - Krupiyeden daha yakın olmak (21’i geçmeden)
   - Krupiyenin batması (21’i geçmesi)

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler
- **HTML5** – Oyun yapısı
- **CSS3** – Stil ve animasyonlar
- **JavaScript (ES6)** – Oyun mantığı ve etkileşim
- **Web Audio API** – Ses efektleri

### Proje Yapısı
```
blackjack-game/
├── blackjack.html    # Ana oyun dosyası
├── blackjack.css     # Stil ve animasyonlar
├── blackjack.js      # Oyun mantığı
└── README.md         # Bu dosya
```

### Temel Özelliklerin Uygulanışı
- **Nesne Tabanlı Tasarım**: Oyun mantığı `BlackjackGame` sınıfında kapsüllendi
- **Asenkron Kart Dağıtımı**: Gerçekçi animasyon için `setTimeout` kullanıldı
- **Dinamik Puanlama**: As kartı (1 veya 11) otomatik yönetilir
- **Ses Yönetimi**: Anında yükleme için Base64 kodlu sesler
- **Duyarlı Tasarım**: Flexbox ile ekran boyutuna uyum sağlar

## 🎨 Özelleştirme

Oyunu kolayca özelleştirmek için şunları değiştirebilirsiniz:
- **Renkler**: `blackjack.css` dosyasındaki renk şemasını düzenleyin
- **Ses Seviyesi**: `blackjack.js` dosyasında `audio.volume` değerini değiştirin (varsayılan: 0.3)
- **Animasyon Hızı**: Kart dağıtım fonksiyonlarındaki `setTimeout` sürelerini ayarlayın
- **Kart Stili**: CSS’teki `.card` sınıflarını değiştirin

## 📱 Tarayıcı Desteği

- Chrome (önerilen)
- Firefox
- Safari
- Edge
- Mobil tarayıcılar (iOS Safari, Chrome Mobile)

## 🤝 Katkıda Bulunma

Projeyi çatallayabilir ve geliştirmeler için pull request gönderebilirsiniz!

Geliştirme fikirleri:
- Bahis sistemi ekle
- Kart bölme ve iki katına çıkarma (split, double down) ekle
- Kart sayma yardımcısı ekle
- Çok oyunculu mod ekle
- Daha fazla görsel efekt ekle

## 📄 Lisans

Bu proje açık kaynaklıdır ve [MIT Lisansı](LICENSE) ile sunulmaktadır.

## 🎯 Gelecek Geliştirmeler

- [ ] Bahis sistemi ve fiş yönetimi
- [ ] İstatistik takibi (galibiyet/mağlubiyet)
- [ ] Farklı zorluk seviyeleri
- [ ] Kart arka yüz tasarımları
- [ ] Arka plan müziği
- [ ] Eğitim modu
- [ ] Başarı sistemi

---

İyi oyunlar! 🎰 Hata veya önerileriniz varsa lütfen bir issue açın.
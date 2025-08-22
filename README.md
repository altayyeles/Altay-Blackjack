# Altay BlackJack

Modern, mobil uyumlu, PWA özellikli Blackjack (Flask + Vanilla JS). Kart görselleri/işlemler **Deck of Cards API** ile; offline için **Service Worker** önbelleği ve yerel pseudo-deste fallback.

## Çalıştırma
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python app.py
# http://127.0.0.1:5000
```

## Deploy (Azure App Service)
```bash
az login
az webapp up --runtime "PYTHON:3.13" --sku B1 --name altayblackjack --logs
```
Varsa **Startup Command**: `gunicorn --bind=0.0.0.0 app:app`

## PWA
- `sw.js` kart görselleri ve app shell'i cache'ler.
- `manifest.webmanifest` ile standalone kurulum.

## Ses
- `static/audio/bgm.mp3` dosyasını ekleyin (Butonla başlatılır).
- `sfx-deal.mp3`, `sfx-win.mp3`, `sfx-lose.mp3` dosyalarını isteğe bağlı ekleyin.

## Notlar
- Yan bahis ödemeleri ayarlardan değiştirilebilir.
- Default tema **light**, dark opsiyonel.
- Başlangıç bakiyesi: **₺1000**.

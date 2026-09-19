# NihonPass — Offizielle Webseite

Dieses Verzeichnis enthält die vollständige, moderne und statische Webseite zur iOS-App **NihonPass**.

Die Seite wurde exakt nach den Vorgaben aus `Werkzeuge/Webseite-Briefing.md` entwickelt:
- **Design:** Authentisches Washi-Papier (`#FBF7EF`), Hanko-Rot (`#D10D14`), Torii-Vektoren, zarte Seigaiha-Wellen, perforierte Tickets mit Einkerbungen und Stempel (`歩`, `休`).
- **Keine Abhängigkeiten:** Pures HTML5, semantisches CSS3 und modernes JavaScript (ES6). Keine `node_modules`, keine Build-Tools erforderlich.
- **Mehrsprachig:** Deutsch (DE), Englisch (EN) und Japanisch (JA) mit automatischer Erkennung und manuellem Umschalter.
- **Datenschutz:** 100 % DSGVO-konform, keine Tracking-Cookies, keine externen Werbe-Tracker.

---

## 1. Lokale Vorschau

Du kannst die Webseite sofort ansehen:
1. **Option A (Einfach):** Mache einfach einen Doppelklick auf `index.html` in deinem Finder.
2. **Option B (Lokaler Server):** Öffne das Terminal und starte den mitgelieferten Python-Server:
   ```bash
   cd Webseite
   python3 -m http.server 8080
   ```
   Öffne anschließend [http://localhost:8080](http://localhost:8080) in deinem Browser.

---

## 2. Die 3 Pflicht-URLs für App Store Connect

Wenn du deine App in App Store Connect einreichst, trägst du folgende URLs ein (ersetze `nihonpass.app` durch deine tatsächliche Domain):

| Feld in App Store Connect | URL auf deiner Webseite |
|---|---|
| **Datenschutz-URL (Privacy Policy URL)** | `https://nihonpass.app/datenschutz.html` |
| **Support-URL** | `https://nihonpass.app/support.html` |
| **Marketing-URL** | `https://nihonpass.app/` |

---

## 3. Eigene Screenshots austauschen

Im Hero-Bereich befindet sich ein detailliertes iPhone-Mockup. Wenn du deine eigenen echten Screenshots aus dem iOS-Simulator oder von deinem iPhone einbinden möchtest:

1. Mache einen Screenshot (z. B. im iPhone 15/16 Pro Format).
2. Speichere die Datei unter `Webseite/assets/images/screenshot_app.png`.
3. In `Webseite/index.html` kannst du im Element `.iphone-screen` den Inhalt durch deinen Screenshot ersetzen:
   ```html
   <div class="iphone-screen">
     <img src="assets/images/screenshot_app.png" alt="NihonPass App Screenshot" style="width: 100%; height: 100%; object-fit: cover;">
   </div>
   ```

---

## 4. Struktur der Dateien

```text
nihonpass/
├── index.html            # Haupt-Landingpage (One-Pager)
├── datenschutz.html      # Datenschutzseite (DE / EN / JA umschaltbar)
├── impressum.html        # Impressum nach § 5 DDG (Pflicht in Deutschland)
├── support.html          # Support & FAQ & Mail-Kontakt
├── presse.html           # Presse-Kit & Factsheet mit Bild-Downloads
├── css/
│   └── style.css         # Vollständiges Responsive Design-System
├── js/
│   ├── main.js           # FAQ-Accordion, Menü, Umschaltungen
│   └── translations.js   # Alle Texte für DE, EN, JA
├── assets/
│   ├── images/           # AppIcon, Begleiter (Tanuki, Shiba, Neko), Screenshots, Watch
│   └── icons/            # Torii SVG, App Store Badges, Seigaiha-Muster
├── .nojekyll             # Deaktiviert Jekyll für schnelleres, zuverlässiges GitHub Pages Hosting
└── README.md             # Diese Dokumentation
```

---

## 5. Kostenloses Hosting (Empfehlungen)

Da die Seite vollständig statisch ist, kann sie überall kostenlos und extrem schnell gehostet werden:

### Option 1: Cloudflare Pages (Sehr empfohlen)
- Extrem schnell, weltweites CDN, kostenloses SSL-Zertifikat.
- Einfach den Ordner `Webseite` per Drag & Drop im Cloudflare-Dashboard hochladen oder mit deinem Git-Repository verknüpfen.

### Option 2: GitHub Pages
- Lege ein Repository an oder aktiviere GitHub Pages in deinen Repository-Einstellungen unter `Settings > Pages`.
- Stelle die Source auf den Ordner `Webseite` oder `/docs`.

### Option 3: Eigener Webspace / Hosting (All-Inkl, Hetzner, IONOS etc.)
- Lade einfach alle Dateien aus dem Ordner `Webseite` per FTP in das `public_html`- oder `www`-Verzeichnis deiner Domain hoch.

---

## 6. Offene Punkte für den Launch

- [ ] **Impressum:** In `impressum.html` deinen Nachnamen und deine Anschrift an den markierten Stellen `[...]` einsetzen.
- [ ] **App Store ID:** Sobald du deine App in App Store Connect angelegt hast, die App-ID im Smart App Banner in `index.html` (`content="app-id=XXXXXXXXXX"`) und den Download-Links eintragen.

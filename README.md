# Swiss Outdoor Planner

Swiss Outdoor Planner ist eine SvelteKit-Prototyp-App, mit der Wander-, Lauf- und Bike-Routen in der Schweiz geplant werden können. Nutzer*innen legen Strecken an, protokollieren absolvierte Aktivitäten (mit Zeit, Stimmung und Bild-Links) und sehen aggregierte Statistiken. MongoDB speichert alle Daten, sodass der Workflow „Planen → Durchführen → Reflektieren“ vollständig abgedeckt ist. Der vollständige Code liegt im öffentlichen GitHub-Repo: https://github.com/Gianone-byte/Swiss-outdoor-planner.

## Haupt-Workflow
1. **Route anlegen** unter `/routes/new` mit Titel, Typ (hike/run/bike), Region, Distanz, optionalen Höhenmetern und Schwierigkeit.
2. **Route betrachten** auf `/routes/[id]`. Nach dem Absolvieren klickt man auf „Log activity“.
3. **Aktivität protokollieren** auf `/routes/[id]/activities/new`: Datum, Startzeit, Dauer, Gefühl, Notizen und bis zu drei Bild-Links eingeben. Die Aktivität erscheint sofort in der Liste und kann später bearbeitet werden.
4. **Fortschritt auswerten** auf `/profile`, wo Gesamtaktivitäten, Distanz und Dauer pro Routentyp sowie die Anzahl Aktivitäten mit Bildern angezeigt werden.

## Seiten & Rollen
- `/` – Dashboard mit jüngsten Aktivitäten und Schnellzugriff auf die wichtigsten Seiten.
- `/routes` – Routenübersicht mit Filter; **Admin** darf Einträge löschen.
- `/routes/new` – Neue Route anlegen.
- `/routes/[id]` – Detailseite mit Aktivitätenliste:
  - User/Admin können Aktivitäten erstellen und bearbeiten.
  - **Admin** darf zusätzlich Distanz/Schwierigkeit anpassen sowie Routen oder Aktivitäten löschen.
- `/routes/[id]/activities/new` – Neue Aktivität für eine Route.
- `/routes/[id]/activities/[activityId]/edit` – Aktivität nachträglich bearbeiten.
- `/activities` – Gesamtübersicht aller Aktivitäten, optional nach Typ filterbar.
- `/profile` – Aggregierte Statistiken.

Die Rollenwahl (user/admin) erfolgt im Header und wird als Cookie gespeichert. Serveraktionen prüfen dieses Cookie, damit z. B. Lösch- oder Editierrechte nur Admins offenstehen.

## Projekt aufsetzen
```bash
npm install
```

`.env` anlegen:
```
MONGO_URI=dein-mongodb-connection-string

# Cloudinary (für Bild-Uploads)
CLOUDINARY_CLOUD_NAME=dein-cloud-name
CLOUDINARY_API_KEY=dein-api-key
CLOUDINARY_API_SECRET=dein-api-secret
CLOUDINARY_FOLDER=swiss-outdoor-planner
```

Dev-Server starten:
```bash
npm run dev
```

## Git & GitHub
Das Repo liegt unter https://github.com/Gianone-byte/Swiss-outdoor-planner. Typischer Workflow:
```bash
git init
git add .
git commit -m "Initial Swiss Outdoor Planner"
git remote add origin https://github.com/<username>/Swiss-outdoor-planner.git
git push -u origin main
```

## Deployment (Netlify)
1. Repository zu GitHub pushen.
2. In Netlify ein neues Projekt aus dem GitHub-Repo erstellen.
3. Environment Variables im Netlify-Dashboard setzen:
   - `MONGO_URI` - MongoDB Connection String
   - `CLOUDINARY_CLOUD_NAME` - Cloudinary Cloud Name
   - `CLOUDINARY_API_KEY` - Cloudinary API Key
   - `CLOUDINARY_API_SECRET` - Cloudinary API Secret
   - `CLOUDINARY_FOLDER` - Ordner für Uploads (z.B. `swiss-outdoor-planner`)
4. Build-Befehl: `npm run build`
5. Publish-Verzeichnis: `build`
- ~~Direkte Bild-Uploads statt Verlinkungen.~~ ✅ Implementiert mit Cloudinary
## Bilder hochladen (Cloudinary)

Die App unterstützt direkte Bild-Uploads zu Cloudinary beim Erstellen und Bearbeiten von Aktivitäten.

### Setup
1. Erstelle einen kostenlosen Account bei [Cloudinary](https://cloudinary.com/).
2. Gehe zum [Cloudinary Dashboard](https://console.cloudinary.com/) und kopiere:
   - **Cloud Name** (z.B. `dxxxxxxx`)
   - **API Key** (z.B. `123456789012345`)
   - **API Secret** (z.B. `abcdefghijklmnopqrstuvwxyz`)
3. Trage diese Werte in deine `.env` Datei ein.

### Features
- **Drag & Drop**: Bilder direkt in die Drop-Zone ziehen.
- **Dateiauswahl**: Klassischer "Dateien auswählen"-Button.
- **URL-Eingabe**: Optional können auch externe Bild-URLs hinzugefügt werden.
- **Vorschau**: Thumbnails werden sofort angezeigt.
- **Validierung**: Max. 3 Bilder pro Aktivität, nur JPG/PNG/WebP, max. 5 MB pro Bild.

### Sicherheit
- **Signed Uploads**: Der Cloudinary API Secret bleibt auf dem Server.
- **Validierung**: Server-seitige Prüfung aller URLs (müssen mit `https://` beginnen).
- **Kein Base64**: Bilder werden direkt zu Cloudinary hochgeladen, nicht in MongoDB gespeichert.

## Erweiterungsideen
- Weitere Filter oder Sortierungen (z. B. Distanz, Schwierigkeit, Region).
- Ausführlichere Statistiken oder Visualisierungen.
- Kartenansicht/Höhenprofil mit Swisstopo oder anderen APIs.
- Direkte Bild-Uploads statt Verlinkungen.
- Gemeinsame Nutzung/Sharing zwischen mehreren Nutzer*innen.

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
3. `MONGO_URI` im Netlify-Dashboard als Environment Variable setzen.
4. Build-Befehl: `npm run build`
5. Publish-Verzeichnis: `build`

## Erweiterungsideen
- Weitere Filter oder Sortierungen (z. B. Distanz, Schwierigkeit, Region).
- Ausführlichere Statistiken oder Visualisierungen.
- Kartenansicht/Höhenprofil mit Swisstopo oder anderen APIs.
- Direkte Bild-Uploads statt Verlinkungen.
- Gemeinsame Nutzung/Sharing zwischen mehreren Nutzer*innen.

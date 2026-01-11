# Projektdokumentation – [Projekttitel]

## Inhaltsverzeichnis

1. [Einordnung & Zielsetzung](#1-einordnung--zielsetzung)
2. [Zielgruppe & Stakeholder](#2-zielgruppe--stakeholder)
3. [Anforderungen & Umfang](#3-anforderungen--umfang)
4. [Vorgehen & Artefakte](#4-vorgehen--artefakte)
    - [Understand & Define](#41-understand--define)
    - [Sketch](#42-sketch)
    - [Decide](#43-decide)
    - [Prototype](#44-prototype)
    - [Validate](#45-validate)
5. [Erweiterungen [Optional]](#5-erweiterungen-optional)
6. [Projektorganisation [Optional]](#6-projektorganisation-optional)
7. [KI‑Deklaration](#7-ki‑deklaration)
8. [Anhang [Optional]](#8-anhang-optional)

> **Hinweis:** Massgeblich sind die im **Unterricht** und auf **Moodle** kommunizierten Anforderungen.

<!-- WICHTIG: DIE KAPITELSTRUKTUR DARF NICHT VERÄNDERT WERDEN! -->

<!-- Diese Vorlage ist für eine README.md im Repository gedacht. Abschnitte mit [Optional] können weggelassen werden, wenn in den Übungen nichts anderes verlangt wird. -->

## 1. Einordnung & Zielsetzung
Kurz beschreiben, welches Problem adressiert wird und welches Ergebnis angestrebt ist.
- **Kontext & Problem:** Menschen, die gerne draussen in der Schweiz unterwegs sind, planen ihre Touren häufig mit bestehenden Kartenlösungen wie Swisstopo. Der Austausch über gemachte Routen, persönliche Erfahrungen, Bilder und Eindrücke ist jedoch nicht zentral organisiert und verteilt sich über verschiedene Plattformen oder bleibt ganz aus.
- **Ziele:** Eine zentrale Web-Applikation schaffen, in der Nutzer ihre Swisstopo-Routen per GPX importieren, Aktivitäten dokumentieren und mit anderen teilen können. Die Plattform soll Inspiration bieten, den Austausch fördern und Outdoor-Erlebnisse übersichtlich und mit geringem Aufwand festhalten.
- **Abgrenzung [Optional]:** Die Applikation bietet keine eigene Routenplanung und keinen Fokus auf sportliche Leistungsanalyse oder Tracking in Echtzeit.

## 2. Zielgruppe & Stakeholder
Wem nützt die Lösung, wer ist beteiligt oder betroffen?
- **Primäre Zielgruppe:** Menschen in der Schweiz, die gerne draussen unterwegs sind (Wandern, Spazieren, Velofahren, Joggen) und ihre Erlebnisse, Routen und Aktivitäten dokumentieren sowie sich mit anderen austauschen möchten – unabhängig von sportlichem Leistungsanspruch.
- **Weitere Stakeholder [Optional]:** _[z. B. Verwaltung, Geschäftsleitung]_  
- **Annahmen [Optional]:** Es wird angenommen, dass Nutzer bereit sind, ihre Outdoor-Aktivitäten zu teilen, wenn der Aufwand gering ist und ein klarer Mehrwert durch Inspiration, Übersicht und visuelle Darstellung entsteht.

## 3. Anforderungen & Umfang
Beschreibt den verbindlichen Umfang gemäss Übungen und allfällige Erweiterungen.
- **Kernfunktionalität (Mindestumfang):** Kernfunktionalität (Mindestumfang):
	•	Route importieren:
Nutzende können eine extern geplante Route (z. B. aus Swisstopo) über eine GPX-Datei importieren und speichern.
	•	Route ansehen:
Importierte Routen können in einer Detailansicht geöffnet werden, inklusive Karten-Vorschau aus den GPX-Daten und Basisinformationen (Typ, Kanton, Distanz, Schwierigkeit).
	•	Aktivität erfassen:
Nutzende können zu einer Route eine Aktivität erfassen (Datum, Dauer, Gefühl, Notizen).
	•	Aktivität ansehen & bearbeiten:
Erfasste Aktivitäten können geöffnet, bearbeitet und gespeichert werden.
	•	Aktivität löschen:
Eigene Aktivitäten können gezielt gelöscht werden.
	•	Feed anschauen:
Nutzende sehen im Feed eigene sowie öffentliche Aktivitäten anderer Nutzender.

Workflows
	•	Route extern planen → GPX importieren → Route ansehen
	•	Aktivität zu Route erfassen → im Feed anzeigen → bearbeiten oder löschen
	•	Öffentliche Aktivitäten anderer Nutzender im Feed ansehen 
- **Akzeptanzkriterien:** 	•	Nutzende können eine GPX-Datei ohne Fehlermeldung importieren und speichern.
	•	Eine Route mit GPX zeigt eine funktionierende Karten-Vorschau.
	•	Nutzende können eine Aktivität vollständig erfassen und speichern.
	•	Änderungen an Aktivitäten werden korrekt übernommen.
	•	Gelöschte Aktivitäten erscheinen nicht mehr im Feed oder in der Übersicht.
	•	Der Feed lädt korrekt und zeigt alle erlaubten (eigenen und öffentlichen) Aktivitäten an.
	•	Alle zentralen Workflows sind ohne zusätzliche Erklärungen verständlich bedienbar.
- **Erweiterungen [Optional]:** 	•	Karten-Preview überall:
Karten-Vorschau aus GPX-Daten direkt im Feed, in Routen- und Aktivitätsansichten.
	•	Bild-Upload:
Bilder können per Drag & Drop hochgeladen werden (Cloudinary), statt nur per URL.
	•	Öffentlich / Privat:
Routen können als öffentlich oder privat markiert werden.
	•	Favoriten:
Öffentliche Routen anderer Nutzender können als Favoriten gespeichert werden.
	•	Benutzerverwaltung:
Registrierung, Login, persönlicher Feed und Profil mit Profilbild.
	•	Profil & Statistik:
Übersicht über eigene Aktivitäten, Distanzen und Nutzung.
Akzeptanzkriterien (Erweiterungen):
	•	Öffentliche Routen sind für andere Nutzende sichtbar, private nicht.
	•	Karten-Previews werden performant und korrekt angezeigt.
	•	Bilder lassen sich hochladen und werden in Aktivitäten dargestellt.
	•	Favorisierte Routen bleiben für den eigenen Account gespeichert.
	•	Nutzende sehen ausschliesslich ihre eigenen privaten Inhalte.


## 4. Vorgehen & Artefakte
Die Durchführung erfolgt phasenbasiert; dokumentieren Sie die wichtigsten Ergebnisse je Phase.

### 4.1 Understand & Define
- **Ausgangslage & Ziele:** 
Viele Menschen in der Schweiz sind gerne draussen unterwegs (Wandern, Velo, Laufen), dokumentieren ihre Erlebnisse jedoch verstreut über verschiedene Tools wie Karten-Apps, Fotos, Notizen oder gar nicht digital. Dadurch fehlt ein zentraler Überblick über absolvierte Routen, persönliche Aktivitäten sowie der Austausch mit anderen.  
Ziel des Swiss Outdoor Planner ist eine einfache Web-Applikation, welche Outdoor-Routen und Aktivitäten strukturiert erfasst, visuell darstellt und einen sozialen Überblick über gemeinsame Erlebnisse ermöglicht – ohne Leistungs- oder Sportfokus.


- **Zielgruppenverständnis:** 
**Problemraumanalyse**

| Nutzer:innen | Bedürfnisse | Kontext / Herausforderungen | HMW |
|--------------|------------|-----------------------------|-----|
| Outdoor-Interessierte (Freizeit) | - Eigene Aktivitäten dokumentieren<br>- Überblick über absolvierte Routen<br>- Erinnerungen festhalten (Text & Fotos) | - Routen liegen in externen Tools (z. B. Swisstopo)<br>- Aktivitäten nicht zentral gespeichert<br>- Kein sozialer Überblick | Wie könnten wir Outdoor-Begeisterte dabei unterstützen, ihre Routen und Aktivitäten einfach, übersichtlich und zentral zu dokumentieren? |
| Community-orientierte Nutzer:innen | - Inspiration durch andere<br>- Öffentliche Routen entdecken<br>- Aktivitäten vergleichen | - Kaum Austauschplattformen ohne Sportdruck<br>- Unübersichtliche bestehende Apps | Wie könnten wir den Austausch über Outdoor-Erlebnisse fördern, ohne Leistungs- oder Wettkampffokus? |

**Recherche**

Bestehende Anwendungen wie Swisstopo oder Komoot fokussieren primär auf Routenplanung und Navigation, weniger auf die persönliche Nachbereitung oder soziale Dokumentation.  
Fitness-Apps legen ihren Schwerpunkt auf Leistung, Statistiken und Tracking.

Eine einfache Web-App, welche Routen importiert, Aktivitäten ergänzt und diese übersichtlich sowie sozial darstellt, schliesst diese Lücke.
- **Wesentliche Erkenntnisse:** _[- Outdoor-Aktivitäten werden aktuell fragmentiert dokumentiert
- Viele Nutzer:innen möchten Erlebnisse festhalten, nicht Leistung messen
- Karten, Fotos und Kommentare gehören zusammen
- Einfache Workflows sind wichtiger als Funktionsvielfalt
- Soziale Sichtbarkeit motiviert zur Nutzung]_

### 4.2 Sketch
- **Variantenüberblick:** 
In der Sketch-Phase wurden mehrere Low-Fidelity-Varianten für den Activity Feed
  und die Routenübersicht entwickelt. Ziel war es, unterschiedliche
  Anordnungen von Karten, Textinhalten und Metadaten zu vergleichen
  sowie zu prüfen, wie stark die Kartenvisualisierung im Verhältnis
  zu Listenansichten gewichtet werden soll.

- **Skizzen:** Die Skizzen zeigen mehrere Varianten desselben Grundkonzepts:
  - Feed als klassische Listenansicht  mit kompakten Aktivitätskarten
  - Feed mit integrierter Karten-Vorschau pro Aktivität
  - Varianten mit zentraler Karte und seitlich oder darunter angeordneten Inhalten
  - Grid-basierte Darstellung für Routen versus lineare Listenstruktur  
  Die Unterschiede betreffen vor allem die Platzierung der Karten,
  die Hierarchie zwischen Text und Visualisierung sowie die Lesbarkeit
  bei mehreren Einträgen.
 ![Sketch-Varianten – Feed & Routen](static/images/skizze4_2.png)

### 4.3 Decide
- **Gewählte Variante & Begründung:** 
Gewählt wurde eine Variante mit zentralem Activity Feed und klarer Trennung zwischen Navigation, Filterbereich und Inhaltsbereich. 
Die Karte ist direkt in jede Aktivität integriert, sodass Route, Kontext und Erlebnis zusammen wahrgenommen werden können.
Diese Variante bietet die beste Balance zwischen Übersicht, sozialer Interaktion und visueller Orientierung und vermeidet eine Überladung durch zu viele parallele Informationen.
- **End‑to‑End‑Ablauf:** 
Nutzende öffnen die App und sehen im Activity Feed die neuesten Aktivitäten der Community. 
Über die Routenseite können bestehende Routen durchsucht und gefiltert werden. 
Eigene Routen werden importiert (z. B. via Swisstopo-Link oder GPX) und anschliessend als Aktivitäten geloggt.
Aktivitäten können mit Text, Feeling und Bildern ergänzt und im Feed veröffentlicht werden.
- **Referenz‑Mockup:** 
https://blend-ebook-43621052.figma.site

Zentrale Übersicht über die neuesten Aktivitäten der Community mit integrierter Karten-Vorschau, Text und Metadaten.
![Activity Feed](static/images/feed.png)

Ansicht zur Verwaltung eigener Routen sowie zum Entdecken öffentlicher Routen mit Filtermöglichkeiten.
![Routenübersicht](static/images/routenübersicht.png)
  
Detaildarstellung einer Aktivität mit Route, Kommentar, Feeling-Bewertung und Bildern.
![Aktivitätsdetail](static/images/aktivitätenübersicht.png)
  
Formular zur Erfassung einer neuen Route mit Metadaten wie Typ, Kanton, Schwierigkeit und optionalem Swisstopo-Link.
![Neue Route](static/images/routenerstellen.png)


### 4.4 Prototype
- **Kernfunktionalität:** 
Der Prototyp ermöglicht es Nutzer:innen, Outdoor-Routen zu entdecken, zu importieren und Aktivitäten darauf zu loggen. 
Routen können über externe Quellen (z. B. Swisstopo-Link oder GPX-Datei) erfasst und gespeichert werden. 
Zu bestehenden Routen lassen sich Aktivitäten mit Dauer, Feeling, Textkommentar und Bildern erfassen. 
Ein zentraler Activity Feed zeigt die neuesten Aktivitäten aller Nutzer:innen inklusive Karten-Vorschau und Medien. 
Zusätzlich können eigene Routen verwaltet, öffentliche Routen entdeckt sowie Aktivitäten gefiltert und ausgewertet werden.


- **Deployment:** 
https://swissoutdoorplanner.netlify.app/feed

#### 4.4.1. Entwurf (Design)
Beschreibt die Gestaltung und Interaktion.
> **Hinweis:** Hier wird der **Prototyp** beschrieben, nicht das **Mockup**.
- **Informationsarchitektur:** 
Die Applikation ist in wenige, klar getrennte Hauptbereiche gegliedert, die über eine permanente Top-Navigation erreichbar sind:

- Feed – Übersicht über die neuesten Aktivitäten aller Nutzer:innen  
- Routen – Verwaltung eigener sowie Entdeckung öffentlicher Routen  
- Aktivitäten – Persönliche Übersicht aller geloggten Aktivitäten  
- Profil – Bearbeitung der Profildaten und Einsicht in Statistiken  

Die Struktur ist bewusst flach gehalten, sodass alle Kernfunktionen mit maximal zwei Klicks erreichbar sind. Primäre Aktionen (z. B. „+ Neue Route“) sind visuell hervorgehoben und kontextbezogen platziert.

- **Oberflächenentwürfe:** 
Der Activity Feed bildet den zentralen Einstiegspunkt der Applikation. Aktivitäten werden als Karten dargestellt und enthalten:

- Profilbild und Username  
- Routentitel, Ort (Kanton & Ort) und Aktivitätstyp  
- Dauer, Distanz und subjektives *Feeling*  
- Kommentar zur Aktivität  
- Integrierte Karten-Vorschau (GPX/Swisstopo)  
- Optional hochgeladene Bilder  

Ziel ist es, Outdoor-Erlebnisse als Geschichte darzustellen und nicht als reine Leistungsdaten.

![Activity Feed](static/images/feedwa.png)

 
Die Routenübersicht ist in „Meine Routen“ und „Öffentliche Routen“ unterteilt. Jede Route wird als Karte mit folgenden Informationen dargestellt:

- Routentitel und Typ  
- Kanton und Ort  
- Distanz und Schwierigkeit  
- Karten-Vorschau der Route  

Filter nach Routentyp, Kanton und Schwierigkeit unterstützen das schnelle Auffinden relevanter Inhalte.

![Routenübersicht](static/images/routenwa.png)


Das Formular zur Routen-Erstellung ist bewusst reduziert und linear aufgebaut. Pflichtfelder sind klar gekennzeichnet, optionale Felder ermöglichen zusätzliche Informationen ohne Überforderung.

- Pflichtfelder: Titel, Typ, Kanton, Distanz, Schwierigkeit  
- Optionale Felder: Ort, Höhenmeter, Swisstopo-Link, GPX-Datei  

Der Fokus liegt auf Einfachheit und Klarheit, damit Routen schnell erfasst werden können.

![Neue Route erstellen](static/images/WAroutenerstellen.png)

In der Aktivitätenübersicht sehen Nutzer:innen ihre eigenen Aktivitäten chronologisch sortiert. Filter nach Routentyp ermöglichen eine gezielte Ansicht. Jede Aktivität enthält erneut Karte, Kommentar und Bilder, um den Erlebnischarakter zu erhalten.

![Aktivitätenübersicht](static/images/aktivitätenwa.png)

 
Im Profil können Nutzer:innen ihren Benutzernamen ändern, ein Profilbild hochladen und ihre persönlichen Aktivitätsstatistiken einsehen. Die Statistik-Karten geben einen schnellen Überblick über Anzahl, Dauer und Typen der Aktivitäten – ohne Wettbewerbs- oder Leistungsdruck.

![Profil & Statistiken](static/images/profilwa.png)

- **Designentscheidungen:** 
- Karten als zentrales Gestaltungselement: Jede Route und Aktivität enthält eine Karten-Vorschau, um den räumlichen Kontext sofort sichtbar zu machen.
- Fokus auf Erlebnisse statt Leistung: Keine Ranglisten oder Vergleichswerte, sondern Kommentare, Bilder und subjektives Feeling.
- Konsistente Kartenlayouts: Einheitliche Kartenstrukturen in Feed, Routen und Aktivitäten erleichtern Orientierung und Wiedererkennung.
- Reduzierte Farbpalette: Ruhige, naturnahe Farben lenken nicht vom Inhalt ab und unterstützen die Lesbarkeit.
- Niedrige Einstiegshürde: Klare Formulare, einfache Filter und verständliche Icons ermöglichen Nutzung auch ohne sportlichen Leistungsfokus.

#### 4.4.2. Umsetzung (Technik)
Fasst die technische Realisierung zusammen.
- **Technologie‑Stack:** 
SvelteKit (Svelte 5) mit Vite, MongoDB-Persistenz via mongodb (MongoDB Atlas), Kartenvisualisierung mit Leaflet, Bild-Uploads über Cloudinary, Deployment via Netlify.

- **Tooling:** 
VS Code, Node.js + npm, Vite Dev Server, GitHub, MongoDB Atlas, Cloudinary, Netlify.

- **Struktur & Komponenten:** Routen: /feed, /routes, /routes/new, /routes/[id], /activities, /profile, /login, /register  
State/Stores: lokal in Svelte 5 ($state), keine globalen Stores.  
Wichtige Komponenten: RouteList.svelte, ActivityList.svelte, MapPreview.svelte, ImageUploader.svelte, Header.svelte.

- **Daten & Schnittstellen [Optional]:** 
Zentrale Datenmodelle sind User, Route und Activity. Routen können externe GPX-Dateien (z. B. aus Swisstopo) enthalten, die serverseitig verarbeitet und clientseitig visualisiert werden. Bilddaten werden über Cloudinary gespeichert und ausgeliefert. Es existiert keine separate REST-API, sämtliche Datenzugriffe erfolgen serverseitig über SvelteKit.

- **Besondere Entscheidungen:** 
Kein integrierter Routenplaner, da die Planung extern (z. B. Swisstopo) erfolgt. Fokus auf Import, Dokumentation und Austausch von Outdoor-Erlebnissen statt Leistungs-Tracking. Einsatz von Leaflet für einfache Karten-Previews und Cloudinary für benutzerfreundliche Drag-and-Drop-Uploads. Reduzierte Architektur ohne globale Stores zugunsten von Einfachheit und Wartbarkeit. 

### 4.5 Validate
- **URL der getesteten Version** 
https://swissoutdoorplanner.netlify.app  
(identisch mit der finalen Produktversion)
- **Ziele der Prüfung:** 
Verstehen Nutzer:innen den grundlegenden Zweck der Plattform (Routen importieren, Aktivitäten dokumentieren, Austausch)?
- Finden Nutzer:innen relevante Inhalte im Feed (eigene und öffentliche Aktivitäten)?
- Ist das Erstellen einer Aktivität (inkl. Bilder-Upload) verständlich und ohne Hürden möglich?
- Wird der Unterschied zwischen eigenen und öffentlichen Routen korrekt wahrgenommen?
- Ist die Kartenansicht (GPX-Preview) hilfreich und verständlich?
- Welche Funktionen werden als besonders wertvoll oder als unnötig wahrgenommen?
 
- **Vorgehen:** _
- Setup: Laptop mit Maus, stabile Internetverbindung, bestehender Nutzeraccount
- Methode: Moderierte 1:1-Usability-Tests mit lautem Denken
- Durchführung: Vor Ort (on-site)
- Aufgabenstellung: Aufgaben wurden mündlich erklärt und nacheinander gestellt
- **Stichprobe:** 
Getestet wurde der Prototyp mit 2 Studierenden, welche mit mir in der Kleinklasse sind.

- **Aufgaben/Szenarien:** 
Feed erkunden  
- Sie öffnen die Plattform und möchten sehen, was andere Nutzer:innen draussen erlebt haben.
- Bitte beschreiben Sie, was Sie im Feed sehen und welche Inhalte für Sie besonders relevant wirken.

Route importieren  
- Sie haben eine Route in Swisstopo geplant und möchten diese auf der Plattform dokumentieren.
- Bitte erstellen Sie eine neue Route, indem Sie eine GPX-Datei importieren und grundlegende Angaben ergänzen.

Aktivität erfassen  
- Sie haben eine Route absolviert und möchten Ihr Erlebnis festhalten.
- Bitte erstellen Sie eine Aktivität mit Kommentar und laden Sie mindestens ein Foto per Drag-and-Drop hoch.

Karte ansehen  
- Sie interessieren sich für eine Route mit Kartenvorschau.
- Bitte öffnen Sie die Route und erklären Sie, was Ihnen die Kartenansicht vermittelt.

Profil prüfen  
- Sie möchten Ihr eigenes Profil ansehen.
- Bitte überprüfen Sie Ihre Profildaten und beschreiben Sie, ob diese vollständig und verständlich sind.
- **Kennzahlen & Beobachtungen:** 
- Erfolgsquote: Alle Testpersonen (2/2) konnten die Kernworkflows (Feed erkunden → Route importieren → Aktivität erstellen → Karte ansehen) erfolgreich durchführen.
- Zeitbedarf: Die Aufgaben wurden ohne längere Unterbrechungen erledigt. Der GPX-Import und der Bilder-Upload wurden als besonders intuitiv wahrgenommen.
- Qualitative Beobachtungen:
  - Der Feed wurde als motivierend und übersichtlich empfunden.
  - Die Kartenansicht half, Routen besser einzuordnen.
  - Der Fokus auf Erlebnisse statt Leistung wurde explizit positiv erwähnt.

- **Zusammenfassung der Resultate:** 
Die Evaluation zeigt, dass der Prototyp von Nutzer:innen schnell verstanden wird und der zentrale Workflow ohne zusätzliche Erklärungen funktioniert. Besonders positiv bewertet wurden der Feed als Inspirationsquelle, die visuelle Kartenvorschau sowie die einfache Möglichkeit, Aktivitäten mit Bildern zu dokumentieren. Die Plattform wurde als ruhig, übersichtlich und nicht leistungsgetrieben wahrgenommen.

- **Abgeleitete Verbesserungen:**  
Hohe Priorität:
- Klarere Hinweise beim GPX-Import: Kurze Erklärung, was mit der Datei passiert und wo die Karte erscheint.
- Feedback nach Aktionen (z. B. Route erstellt, Aktivität gespeichert): Visuelle Bestätigung erhöht Sicherheit.

Mittlere Priorität:
- Erweiterung des Feeds um Filter (z. B. nur Routen, nur Aktivitäten).
- Bessere visuelle Trennung zwischen Text, Karte und Bildern in Aktivitäten.

Tiefe Priorität:
- Kommentarfunktion unter Aktivitäten für mehr Austausch.
- Möglichkeit, andere Nutzer:innen zu abonnieren.
- **Umgesetzte Anpassungen [Optional]:** 
- Kartenvorschau (Leaflet) wurde prominent in Routen, Aktivitäten und Feed integriert.
- Bilder-Upload wurde von reinen Links auf Drag-and-Drop mit Cloudinary umgestellt.

## 5. Erweiterungen [Optional]
Dokumentiert Erweiterungen über den Mindestumfang hinaus.
- **Beschreibung & Nutzen:** 
Authentifizierung & Benutzerverwaltung  
Die Anwendung wurde um ein vollständiges Login- und Registrierungssystem erweitert. Dadurch kann jede Nutzer:in eigene Routen und Aktivitäten verwalten, während öffentliche Inhalte von anderen eingesehen werden können. Dies ermöglicht realistische Nutzungsszenarien und eine klare Trennung zwischen privaten und öffentlichen Inhalten.

Öffentliche und private Routen  
Routen können als öffentlich oder privat markiert werden. Öffentliche Routen dienen der Inspiration für andere Nutzer:innen, während private Routen nur für die eigene Dokumentation sichtbar sind. Dies fördert sowohl Austausch als auch Privatsphäre.

GPX-Import mit Karten-Vorschau  
Routen werden nicht manuell geplant, sondern aus externen Tools (z. B. Swisstopo) via GPX-Datei importiert. Die GPX-Daten werden serverseitig verarbeitet und als interaktive Karten-Vorschau (Leaflet) angezeigt. Dadurch erhalten Nutzer:innen eine visuelle Orientierung zur Route.

Aktivitäten-Feed  
Ein zentraler Feed zeigt eigene Aktivitäten sowie öffentliche Aktivitäten anderer Nutzer:innen. Der Feed dient als Inspirations- und Austauschplattform und bildet den sozialen Kern der Anwendung.

Bilder-Upload per Drag & Drop  
Aktivitäten können mit Bildern ergänzt werden. Statt Bild-Links zu verwenden, wurde ein echter Upload per Drag & Drop integriert (Cloudinary). Dies senkt die Einstiegshürde und verbessert die Nutzererfahrung deutlich.

Profilverwaltung  
Nutzer:innen können ein Profil mit Username und Profilbild pflegen. Dadurch werden Aktivitäten und Inhalte persönlicher und im Feed besser zuordenbar.

- **Umsetzung in Kürze:** 
Authentifizierung & Benutzerverwaltung  
Die Authentifizierung wurde serverseitig mit SvelteKit umgesetzt. Passwörter werden gehasht gespeichert, Sessions über Cookies verwaltet. Alle relevanten Server-Loads und Actions prüfen den eingeloggten User und filtern Daten anhand der userId.

Öffentliche und private Routen  
Jede Route besitzt ein visibility-Feld (public / private). Serverseitige Zugriffsprüfungen stellen sicher, dass private Routen nur vom Eigentümer gesehen werden können. Öffentliche Routen sind für alle eingeloggten Nutzer:innen sichtbar, jedoch schreibgeschützt.

GPX-Import mit Karten-Vorschau  
GPX-Dateien werden beim Erstellen einer Route hochgeladen und serverseitig geparst. Die Koordinaten werden extrahiert und an eine Leaflet-Komponente übergeben, welche die Route als Polyline darstellt. Der Zugriff auf GPX-Daten ist ebenfalls durch Berechtigungen geschützt.

Aktivitäten-Feed  
Der Feed kombiniert eigene Aktivitäten mit öffentlichen Aktivitäten anderer Nutzer:innen. Die Daten werden serverseitig aggregiert und nach Sichtbarkeit gefiltert ausgeliefert.

Bilder-Upload per Drag & Drop  
Der Upload erfolgt über Cloudinary. Eine serverseitige Signatur-Route stellt sichere Uploads sicher. Die resultierenden Bild-URLs werden in der Aktivität gespeichert und im Feed sowie in Detailansichten angezeigt.

Profilverwaltung  
Profilinformationen (Username, Avatar) werden in der User-Collection gespeichert und bei allen relevanten Ansichten mitgeladen.

- **Abgrenzung zum Mindestumfang:** 
Authentifizierung & Benutzerverwaltung  
Der Mindestumfang erfordert keine Mehrbenutzerfähigkeit. Die Anwendung könnte auch ohne Login funktionieren. Die Benutzerverwaltung stellt eine funktionale Erweiterung dar.

Öffentliche und private Routen  
Sichtbarkeitslogik und Zugriffsrechte sind nicht Teil der Kernanforderungen und erweitern den Funktionsumfang deutlich.

GPX-Import & Karten-Vorschau  
Der Mindestumfang verlangt keine Kartenintegration. Die visuelle Darstellung von Routen ist eine qualitative Erweiterung.

Aktivitäten-Feed  
Ein sozialer Feed ist nicht Teil der geforderten Kernfunktionalität, erhöht jedoch den Nutzwert und die Motivation.

Bilder-Upload  
Datei-Uploads sind nicht gefordert. Die Integration von Cloudinary stellt eine technische und UX-Erweiterung dar.

Profilverwaltung  
Personalisierte Profile gehen über den Mindestumfang hinaus und unterstützen die soziale Nutzung der Plattform.

## 6. Projektorganisation [Optional]
Beispiele:
- **Repository & Struktur:** 
https://github.com/Gianone-byte/Swiss-outdoor-planner.git
- src/routes – Seiten, Server Loads und Actions (Feed, Routes, Activities, Auth)
- src/lib/components – Wiederverwendbare UI-Komponenten (Listen, MapPreview, ImageUploader)
- src/lib/server – Serverlogik (Auth, GPX-Parser, Datenbank)
- static/images – Screenshots und Dokumentationsassets
- static – Öffentliche Assets

- **Issue‑Management:** 
Es wurde kein formales Issue-Board verwendet. Aufgaben und Probleme wurden iterativ während der Entwicklung identifiziert und direkt umgesetzt. Grössere Funktionsblöcke wurden nacheinander abgeschlossen.

- **Commit‑Praxis:** 
Es wurden sprechende, feature-orientierte Commits verwendet (z. B. „Login und Authentifizierung“, „Swisstopo Link und GPX“, „Karten-Preview mit Leaflet“, „Cloudinary Bild-Upload“). Commits sind thematisch zusammenhängend und nachvollziehbar.

## 7. KI‑Deklaration
Die folgende Deklaration ist verpflichtend und beschreibt den Einsatz von KI im Projekt.

### Eingesetzte KI‑Werkzeuge
- ChatGPT (OpenAI)
- Claude (Anthropic)
- GitHub Copilot / Codex

### Zweck & Umfang
_[**wie, wofür und in welchem Ausmass** wurde KI eingesetzt (z. B. Textentwürfe, Codevorschläge, Tests, Refactoring) sowie **Überlegungen** zu Qualität, Urheberrecht/Quellen und Prompt‑Vorgehen]_
KI wurde zur Unterstützung bei Konzeption, Textformulierung, UI-Iteration sowie bei Codevorschlägen für SvelteKit-Komponenten und serverseitige Logik eingesetzt. Die KI diente als Assistenz bei der Entwicklung, nicht als alleinige Umsetzungsinstanz. Alle Vorschläge wurden geprüft, angepasst und manuell getestet.

Der Einsatz umfasste:
- Strukturierung der Workflows und Seiten
- Vorschläge für SvelteKit-Server-Actions und Komponenten
- Unterstützung bei GPX-Parsing, Kartenintegration (Leaflet) und Datei-Uploads (Cloudinary)
- Formulierungen für Dokumentation und README

### Art der Beiträge
- Teile der Dokumentation und Textinhalte wurden mit KI entworfen und anschliessend überarbeitet.
- Code-Skizzen und Lösungsvorschläge (z. B. Authentifizierung, GPX-Verarbeitung, Upload-Flows) wurden mit KI erstellt und manuell angepasst.
- UX- und Design-Entscheidungen wurden iterativ anhand von Screenshots mit KI reflektiert.

### Eigene Leistung (Abgrenzung)
Die Konzeption des Produkts, die Auswahl und Priorisierung der Funktionen, die Integration der einzelnen Systeme (Auth, Datenbank, Karten, Uploads), das Testen sowie die finale Umsetzung und Anpassung erfolgten eigenständig. Der Code wurde selbstständig verstanden, angepasst und in die bestehende Struktur integriert.


### Reflexion
Nutzen:  
KI ermöglichte schnelle Iterationen, half bei komplexeren technischen Fragestellungen und unterstützte die saubere Formulierung der Dokumentation.

Grenzen:  
Einige Vorschläge waren unpräzise oder nicht direkt einsetzbar und erforderten Nacharbeit. Insbesondere bei Sicherheits- und Architekturfragen war manuelle Kontrolle notwendig.

Risiken & Qualitätssicherung:  
Alle Änderungen wurden lokal getestet, im Browser überprüft und mit den Projektanforderungen abgeglichen. Kritische Logik (Auth, Sichtbarkeit, Uploads) wurde bewusst serverseitig umgesetzt.

### Prompt‑Vorgehen [Optional]
Prompts wurden iterativ verfeinert, häufig ergänzt durch Screenshots der aktuellen Umsetzung oder konkrete Fehlermeldungen, um zielgerichtete Vorschläge zu erhalten.


### Quellen & Rechte [Optional]
_[verwendete Vorlagen/Assets/Modelle; Lizenz/Urheberrecht; Zitierweise]_

## 8. Anhang [Optional]
Beispiele:
- **Testskript & Materialien:** _[Link/Datei]_  
- **Rohdaten/Auswertung:** _[Link/Datei]_  

---

<!-- Prüfliste (nicht abgeben, nur intern nutzen) -->
<!--
[ ] Kernfunktionalität gemäss Übungen umgesetzt (Workflows durchgängig)
[ ] Akzeptanzkriterien formuliert und erfüllt
[ ] Skizzen erstellt (mehrere Varianten, Unterschiede dokumentiert)
[ ] Referenz‑Mockup in Decide verlinkt (URL/Screenshots)
[ ] Deployment erreichbar
[ ] Umsetzung (Technik) vollständig (Technologie‑Stack; Tooling & KI‑Einsatz inkl. Überlegungen; Struktur/Komponenten; Daten/Schnittstellen falls genutzt)
[ ] Evaluation durchgeführt; Ergebnisse dokumentiert; Verbesserungen abgeleitet
[ ] Dokumentation vollständig, klar strukturiert und konsistent
[ ] KI‑Deklaration ausgefüllt (Werkzeuge; Zweck & Umfang; Art der Beiträge; Abgrenzung; Quellen & Rechte; optional: Prompt‑Vorgehen, Reflexion)
[ ] Erweiterungen (falls vorhanden) begründet und abgegrenzt
[ ] Anhang gepflegt (Testskript/Materialien, Rohdaten/Auswertung) [optional]
-->
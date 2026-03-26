# Parliament Browser v1.0 - Ålands Lagting

En React Native-applikation för att utforska ledamöter i Ålands lagting. Appen hämtar data live från Lagtingets officiella API.

## Funktionalitet
* **Välkomstskärm:** En enkel och tydlig startpunkt för applikationen.
* **Ledamotslista:** Visar samtliga 250 poster från API:et (historiskt arkiv).
* **Sökfunktion:** Realtidssökning som filtrerar ledamöter på för- och efternamn.
* **Sortering:** Listan sorteras automatiskt i bokstavsordning (A-Ö) baserat på efternamn.
* **Detaljvy:** Fördjupad information om varje ledamot, inklusive hemort, födelsedata och politisk status.
* **Data-tvätt:** Appen rensar automatiskt bort postnummer från stadsnamn för bättre läsbarhet.
* **Felhantering:** Appen använder reservikoner om en ledamot saknar bild i API:et för att förhindra krascher.

## Användning av AI i projektet
I detta projekt har AI använts på följande sätt:
1. **Felsökning:** AI har hjälpt till att identifiera varför vissa bilder inte visades i detaljvyn genom att förklara skillnaden mellan strängar och objekt i API-responsen.
2. **Dataanalys:** Hjälp med att förstå API-strukturen, specifikt varför vissa ledamöter saknades (statiska exporter vs live-data) och hur statuskoder (1, 2, 3) skulle mappas till klartext.
3. **Dokumentation:** AI har hjälpt till att sammanställa och strukturera denna README-fil, tekniska förklaringar och kommentarer i koden för att göra projektet mer överskådligt.

## Tekniska detaljer
* **Framework:** React Native (Expo)
* **UI-bibliotek:** React Native Paper
* **Navigation:** React Navigation (Stack)
* **API:** https://api.lagtinget.ax/api/persons.json

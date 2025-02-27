# Database Schema Design – LifeVerse

## Inhaltsverzeichnis

- [Database Schema Design – LifeVerse](#database-schema-design--lifeverse)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [1. Einleitung](#1-einleitung)
  - [2. Datenbank-Architektur](#2-datenbank-architektur)
  - [3. Datenbanktabellen und -beziehungen](#3-datenbanktabellen-und--beziehungen)
    - [Wichtige Tabellen](#wichtige-tabellen)
  - [4. Datenmodell für Spieler und Spielfortschritt](#4-datenmodell-für-spieler-und-spielfortschritt)
  - [5. Datenmodell für NPCs und Quests](#5-datenmodell-für-npcs-und-quests)
  - [6. Datenmodell für Wirtschaft und Ressourcen](#6-datenmodell-für-wirtschaft-und-ressourcen)
  - [7. Datenmodell für die Welt und Umgebung](#7-datenmodell-für-die-welt-und-umgebung)
  - [8. Datenbank-Optimierung](#8-datenbank-optimierung)
  - [9. Sicherheit und Datenschutz](#9-sicherheit-und-datenschutz)
  - [10. Zukunftsperspektiven und Erweiterungen](#10-zukunftsperspektiven-und-erweiterungen)

---

## 1. Einleitung

Das Datenbankschema für *LifeVerse* ist die Grundlage für die Verwaltung und Speicherung aller Spiel- und Spielerinformationen. Die Datenbankstruktur muss flexibel, skalierbar und effizient sein, um mit den wachsenden Anforderungen des Spiels umzugehen. Diese Datei beschreibt das Datenbankdesign, einschließlich der wichtigsten Tabellen und ihrer Beziehungen, die für die Speicherung von Spielerinformationen, Spielfortschritt, NPC-Daten, Quests und Ressourcen erforderlich sind.

---

## 2. Datenbank-Architektur

*LifeVerse* nutzt ein relationales Datenbankmanagementsystem (RDBMS), das für seine Flexibilität und Skalierbarkeit bekannt ist. Die Datenbank ist in mehrere Hauptmodule unterteilt:

- **Spieler-Modul**: Speichert alle relevanten Informationen über Spieler, ihre Fortschritte und Leistungen.
- **NPC-Modul**: Verwalten von NPC-Daten, Interaktionen und Verhalten.
- **Wirtschafts-Modul**: Speichert alle Ressourcen, Wirtschaftsdaten und Transaktionen im Spiel.
- **Welt-Modul**: Enthält Daten zu Umgebungen, Leveln und Weltstatus.
- **Quest-Modul**: Speichert Quests, Aufgaben und deren Fortschritt.

Die Datenbank wird in mehreren Tabellen organisiert, wobei Beziehungen zwischen den Tabellen über Primär- und Fremdschlüssel definiert sind.

---

## 3. Datenbanktabellen und -beziehungen

### Wichtige Tabellen

1. **players**:
   - *player_id* (PK): Eindeutige ID des Spielers
   - *username*: Benutzername des Spielers
   - *email*: E-Mail-Adresse
   - *password_hash*: Verschlüsseltes Passwort
   - *level*: Aktuelles Level des Spielers
   - *xp*: Erfahrungspunkte des Spielers
   - *gold*: Menge an Gold, das der Spieler besitzt
   - *created_at*: Zeitpunkt der Spieleranmeldung
   - *last_login*: Letztes Login-Datum

2. **npcs**:
   - *npc_id* (PK): Eindeutige ID des NPCs
   - *name*: Name des NPCs
   - *type*: Typ des NPCs (z.B. Händler, Gegner)
   - *location*: Standort des NPCs in der Welt
   - *dialogue*: Dialogoptionen, die mit diesem NPC verfügbar sind

3. **quests**:
   - *quest_id* (PK): Eindeutige ID der Quest
   - *title*: Titel der Quest
   - *description*: Beschreibung der Quest
   - *type*: Typ der Quest (z.B. Sammeln, Kämpfen)
   - *reward_gold*: Belohnung in Gold
   - *reward_xp*: Belohnung in Erfahrungspunkten
   - *npc_id* (FK): Verknüpfung zu einem NPC, der die Quest vergibt

4. **player_quests**:
   - *player_id* (FK): Verknüpfung zu einem Spieler
   - *quest_id* (FK): Verknüpfung zu einer Quest
   - *status*: Status der Quest (z.B. "in Arbeit", "abgeschlossen")
   - *progress*: Fortschritt der Quest (z.B. gesammelte Objekte)

5. **resources**:
   - *resource_id* (PK): Eindeutige ID der Ressource
   - *name*: Name der Ressource
   - *amount*: Menge der Ressource
   - *type*: Ressourcentyp (z.B. Holz, Stein, Nahrung)

6. **player_resources**:
   - *player_id* (FK): Verknüpfung zu einem Spieler
   - *resource_id* (FK): Verknüpfung zu einer Ressource
   - *amount*: Menge der Ressource, die der Spieler besitzt

7. **worlds**:
   - *world_id* (PK): Eindeutige ID der Welt
   - *name*: Name der Welt
   - *type*: Welttyp (z.B. Stadt, Dschungel, Wüste)
   - *status*: Status der Welt (z.B. "aktiv", "inaktiv")

8. **player_worlds**:
   - *player_id* (FK): Verknüpfung zu einem Spieler
   - *world_id* (FK): Verknüpfung zu einer Welt
   - *progress*: Fortschritt des Spielers in der Welt (z.B. besuchte Gebiete)

---

## 4. Datenmodell für Spieler und Spielfortschritt

Das Spieler-Modul speichert alle notwendigen Daten für den Spielfortschritt eines Spielers. Es umfasst:

- **Spielerdaten**: Eindeutige Identifikation, Benutzername, Email, Passwort.
- **Level und XP**: Das Spielerlevel und die entsprechenden Erfahrungspunkte werden kontinuierlich aktualisiert.
- **Ressourcen und Wirtschaft**: Gold und andere Ressourcen, die der Spieler besitzt, sowie Transaktionen oder Käufe.
- **Fortschritt und Quests**: Der Questfortschritt wird in der `player_quests`-Tabelle gespeichert und regelmäßig aktualisiert.

---

## 5. Datenmodell für NPCs und Quests

NPCs sind zentrale Bestandteile der Spielwelt und interagieren mit Spielern durch Quests und Dialoge:

- **NPC-Daten**: Enthält Informationen wie Name, Typ und Standort.
- **Quest-Daten**: Jede Quest ist einem NPC zugeordnet und bietet den Spielern bestimmte Belohnungen (Gold, XP, Items).
- **Quest-Status**: Jede Quest hat einen Fortschritt, der im `player_quests`-Modul verfolgt wird.

---

## 6. Datenmodell für Wirtschaft und Ressourcen

Die Wirtschaft von *LifeVerse* basiert auf Ressourcen, die die Spieler sammeln und nutzen können:

- **Ressourcen**: Jede Ressource (z.B. Holz, Stein) hat eine eigene ID und wird in der `resources`-Tabelle verwaltet.
- **Spieler-Ressourcen**: Jeder Spieler hat eine eigene Ressourcensammlung, die in der `player_resources`-Tabelle gespeichert wird.
- **Transaktionen**: Das Wirtschaftssystem kann Transaktionen zwischen Spielern oder mit NPCs beinhalten (z.B. Kauf und Verkauf).

---

## 7. Datenmodell für die Welt und Umgebung

Die Welt von *LifeVerse* ist dynamisch und besteht aus verschiedenen Regionen, die von den Spielern erkundet werden können:

- **Welten**: Jede Welt hat ihre eigene ID und spezielle Eigenschaften (z.B. Standort, Typ).
- **Spielerwelten**: Das Modell speichert, welche Welten der Spieler besucht hat und wie weit er in jeder Welt fortgeschritten ist.

---

## 8. Datenbank-Optimierung

- **Indexierung**: Häufig abgefragte Felder (z.B. Spieler-ID, Quest-ID, Ressource) werden indiziert, um die Abfragegeschwindigkeit zu verbessern.
- **Normalisierung**: Daten werden so weit wie möglich normalisiert, um Redundanz zu vermeiden und Datenintegrität zu gewährleisten.
- **Datenkompression**: Große Mengen an Spielerinformationen und Ressourcen werden komprimiert, um die Speichernutzung zu optimieren.

---

## 9. Sicherheit und Datenschutz

- **Passwortverschlüsselung**: Alle Passwörter der Spieler werden mit einem sicheren Hash-Verfahren verschlüsselt (z.B. bcrypt).
- **Datenverschlüsselung**: Sensible Spielerinformationen (z.B. Transaktionsdaten) werden verschlüsselt gespeichert, um die Datensicherheit zu gewährleisten.
- **Zugriffsrechte**: Jeder Benutzer (Spieler, Moderator, Administrator) hat unterschiedliche Zugriffsrechte auf die Datenbank.

---

## 10. Zukunftsperspektiven und Erweiterungen

- **Erweiterung der Datenbankstruktur**: Mit der Weiterentwicklung von *LifeVerse* können zusätzliche Module und Tabellen zur Unterstützung neuer Features (z.B. PvP, Gilden) hinzugefügt werden.
- **Cloud-Integration**: Die Datenbank könnte in Zukunft stärker mit Cloud-Diensten integriert werden, um eine bessere Skalierbarkeit und Flexibilität zu erreichen.
- **Optimierung der Performance**: Durch den Einsatz fortschrittlicherer Techniken (z.B. Sharding, Caching) kann die Datenbank für eine höhere Spieleranzahl optimiert werden.

---

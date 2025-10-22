# Git Workflow

## Introduction

Ein klar definierter Git-Workflow ist entscheidend, um die Codebasis konsistent und gut strukturiert zu halten. In diesem Dokument wird der Git-Workflow für das LifeVerse-Projekt beschrieben, um sicherzustellen, dass alle Teammitglieder effektiv zusammenarbeiten und Änderungen nachverfolgen können.

## Ziele des Git Workflows

1. **Sauberer Code**  
   Jeder Commit soll einen spezifischen, klar definierten Zweck haben. Dies erleichtert das Auffinden von Fehlern und verbessert die Zusammenarbeit.

2. **Vermeidung von Konflikten**  
   Durch eine klare Struktur und ein konsequentes Vorgehen beim Arbeiten mit Branches und Merges werden Konflikte minimiert.

3. **Transparenz und Nachverfolgbarkeit**  
   Alle Änderungen sollten nachvollziehbar und dokumentiert sein, sodass jeder Teammitglied jederzeit den Stand der Entwicklung einsehen kann.

## Git Branching Model

### 1. Hauptbranch (`main`)
Der `main`-Branch repräsentiert die stabilste Version des Codes. Alle Änderungen, die als stabil gelten, werden in diesen Branch gemerged. Der `main`-Branch ist der Branch, der in Produktion geht und für die Veröffentlichung von Versionen verwendet wird.

### 2. Entwicklungsbranch (`development`)
Der `development`-Branch ist der Hauptarbeitsbranch für alle Feature-Entwicklungen. Alle neuen Funktionen, Bugfixes und Tests werden hier entwickelt und getestet, bevor sie in den `main`-Branch gemerged werden. Der `development`-Branch wird regelmäßig mit dem `main`-Branch synchronisiert, um sicherzustellen, dass keine wichtigen Änderungen übersehen werden.

### 3. Feature Branches
Feature Branches werden für die Entwicklung neuer Funktionen oder Features erstellt. Sie sollten immer vom `development`-Branch abgezweigt werden und einen klaren Namen erhalten, der das Feature beschreibt (z. B. `feature/login-system` oder `feature/ai-improvements`).

- **Erstellung eines Feature Branches:**
  ```bash
  git checkout development
  git checkout -b feature/feature-name

	•	Merge zurück in den Development-Branch:
Wenn die Feature-Arbeiten abgeschlossen sind, wird der Feature-Branch in den development-Branch gemerged:

git checkout development
git merge feature/feature-name



4. Bugfix Branches

Bugfix Branches werden verwendet, um Fehler im Code zu beheben. Diese Branches sollten immer vom development-Branch oder main-Branch erstellt werden, abhängig davon, ob der Fehler bereits in der Produktion aufgetreten ist.
	•	Erstellung eines Bugfix Branches:

git checkout development
git checkout -b bugfix/bug-description


	•	Merge zurück in den Development- oder Main-Branch:
Sobald der Fehler behoben ist, wird der Bugfix-Branch wieder in den entsprechenden Branch gemerged:

git checkout development
git merge bugfix/bug-description



5. Hotfix Branches

Hotfixes sind kritische Fehlerbehebungen, die sofort in die Produktionsversion (den main-Branch) übernommen werden müssen. Hotfix-Branches sollten immer direkt vom main-Branch erstellt werden.
	•	Erstellung eines Hotfix Branches:

git checkout main
git checkout -b hotfix/critical-bug


	•	Merge zurück in den Main- und Development-Branch:
Nach der Behebung des kritischen Fehlers wird der Hotfix in den main- und development-Branch gemerged:

git checkout main
git merge hotfix/critical-bug
git checkout development
git merge hotfix/critical-bug



Commit Guidelines

1. Commit-Nachrichten

Commit-Nachrichten müssen klar und präzise sein. Sie sollten den Zweck der Änderung und die betroffenen Bereiche des Codes beschreiben. Eine gängige Struktur für Commit-Nachrichten ist:
	•	Typ: (z. B. feat für neue Features, fix für Fehlerbehebungen, docs für Dokumentationsänderungen)
	•	Kurze Beschreibung: Eine prägnante Zusammenfassung der Änderung.
	•	Optionale Details: Weitere Details, warum die Änderung vorgenommen wurde (optional).

Beispiel:

feat(user-auth): Implement login functionality
- Added user authentication system with JWT tokens
- Integrated login form and validation

2. Häufigkeit der Commits

Commits sollten regelmäßig und in kleinen, überschaubaren Schritten erfolgen. Dadurch wird der Überblick über den Fortschritt gewahrt und die Fehlerbehebung wird einfacher.

Merge-Strategie

1. Merge mit development-Branch

Bevor ein Feature- oder Bugfix-Branch in development gemerged wird, sollten alle Änderungen mit dem neuesten Stand des development-Branches synchronisiert werden, um Konflikte zu minimieren.
	•	Merge von development in den Feature-Branch:

git checkout feature/feature-name
git fetch origin
git merge origin/development


	•	Lösen von Merge-Konflikten:
Wenn Konflikte auftreten, müssen diese manuell gelöst werden. Nach der Lösung der Konflikte sollten die Änderungen wieder committet werden.

2. Pull-Requests

Ein Pull-Request (PR) sollte erstellt werden, wenn eine Funktion oder ein Bugfix abgeschlossen ist und in den development-Branch gemerged werden soll. Der PR sollte von einem anderen Teammitglied überprüft und freigegeben werden, bevor der Merge durchgeführt wird.

Tagging und Versionierung

Verwenden Sie Tags, um Versionen des Spiels zu kennzeichnen, wenn der Code für die Produktion bereit ist. Tags sollten in der Regel auf dem main-Branch gesetzt werden.
	•	Tagging einer neuen Version:

git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0



Beste Praktiken für Git Workflow
	1.	Regelmäßige Synchronisation
Häufige Synchronisation mit dem development-Branch hilft, Konflikte zu vermeiden.
	2.	Kleine Commits
Führen Sie kleine und gezielte Commits durch. Vermeiden Sie große “All-in-One”-Commits, die schwer zu überprüfen und zu debuggen sind.
	3.	Kommunikation im Team
Sorgen Sie dafür, dass alle Teammitglieder auf dem gleichen Stand sind, indem Sie regelmäßig den Git-Status und Änderungen prüfen.
	4.	Code-Reviews und Pull-Requests
Bevor Änderungen gemerged werden, sollten sie von anderen Teammitgliedern überprüft werden, um die Codequalität sicherzustellen.
	5.	Feature-Flags verwenden
Verwenden Sie Feature-Flags, um neue Funktionen ohne Unterbrechung des Hauptsystems zu testen. Feature-Flags ermöglichen es, Funktionen schrittweise zu aktivieren.

Fazit

Ein gut definierter Git-Workflow hilft dabei, das Projekt strukturiert zu halten und sicherzustellen, dass Änderungen kontrolliert und ohne Konflikte vorgenommen werden. Ein klarer Branching- und Commit-Prozess sowie eine transparente Zusammenarbeit im Team sind entscheidend für den Erfolg des Projekts.

Lass mich wissen, wenn du noch etwas anderes benötigst!
import { AssessmentQuestion } from '../managerAssessment';

export const DE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    dimension: 'reality',
    title: 'Diskrepanz bei der Produktionsausbeute',
    scenario: 'Das monatliche Dashboard weist eine Effizienz der Verpackungslinie von 92% aus, doch das Fertigwarenlager meldet Lieferengpässe bei kritischen Aufträgen.',
    options: [
      { id: 'a', score: 3, text: 'Dem digitalen Bericht vertrauen und vom Lagerleiter eine Erklärung für verlorene oder nicht erfasste Waren verlangen.' },
      { id: 'b', score: 2, text: 'Den Produktionsleiter auffordern, die Ertragstabellen neu zu berechnen und abzugleichen.' },
      { id: 'c', score: 0, text: 'Persönlich in die Werkshalle und ins Lager gehen, um unregistrierte Mikrostopps und verdeckten Ausschuss direkt vor Ort zu untersuchen.' },
      { id: 'd', score: 1, text: 'Eine gemeinsame Abstimmungssitzung zwischen Produktion, Logistik und Vertrieb einberufen.' }
    ]
  },
  {
    id: 2,
    dimension: 'reality',
    title: 'Kritische Qualitätsreklamation eines Schlüsselkunden',
    scenario: 'Ein wichtiger Großkunde beschwert sich direkt darüber, dass die Qualität der letzten Lieferung drastisch eingebrochen ist.',
    options: [
      { id: 'a', score: 2, text: 'Das Qualitätssicherungsteam umgehend rügen oder bestrafen.' },
      { id: 'b', score: 0, text: 'Muster der Charge, Prüfberichte, Schichtprotokolle und Lieferdaten prüfen und das persönliche Gespräch mit dem Einkäufer suchen.' },
      { id: 'c', score: 3, text: 'Den Vertrieb anweisen, dem Kunden einen Rabatt auf die nächste Bestellung zu gewähren, um ihn zu beruhigen.' },
      { id: 'd', score: 1, text: 'Einen vorübergehenden Produktionsstopp anordnen, bis eine informelle Prüfung stattgefunden hat.' }
    ]
  },
  {
    id: 3,
    dimension: 'reality',
    title: 'Rabattierte Rohstoffcharge ohne Laborfreigabe',
    scenario: 'Ein langjähriger Lieferant bietet eine Rohstoffcharge mit 15% Rabatt an, die finale Qualitätsfreigabe des Labors steht jedoch noch aus.',
    options: [
      { id: 'a', score: 3, text: 'Den Großeinkauf sofort freigeben, um die dringende finanzielle Einsparung zu sichern.' },
      { id: 'b', score: 2, text: 'Den Zukauf einer begrenzten Menge ohne Anlagentest unter Verantwortung des Einkaufsleiters gestatten.' },
      { id: 'c', score: 0, text: 'Großbestellungen stoppen, bis Pilottests und die Auswirkungen auf die Ausschussquote eindeutig überprüft wurden.' },
      { id: 'd', score: 1, text: 'Vom Lieferanten eine schriftliche Qualitätsgarantie einfordern und den Kauf abwickeln.' }
    ]
  },
  {
    id: 4,
    dimension: 'execution',
    title: 'Blockierte Beschlüsse der Geschäftsführung',
    scenario: 'In der Führungskräfterunde wurden 5 zentrale Maßnahmen zur Ausschussreduzierung beschlossen, doch nach zwei Wochen ist kein messbarer Fortschritt erkennbar.',
    options: [
      { id: 'a', score: 3, text: 'Die Führungskräfte beim nächsten Meeting scharf ermahnen und neue Notfall-Ultimaten setzen.' },
      { id: 'b', score: 0, text: 'Für jeden Beschluss einen bevollmächtigten Verantwortlichen, verbindliche Fristen, messbare KPIs und wöchentliche Reviews definieren.' },
      { id: 'c', score: 2, text: 'Die Umsetzung aller 5 Aufgaben persönlich übernehmen, um Tempo zu erzwingen.' },
      { id: 'd', score: 1, text: 'Die Nachverfolgung an einen externen Berater oder einen Sonderausschuss übertragen.' }
    ]
  },
  {
    id: 5,
    dimension: 'execution',
    title: 'Zeit- und Budgetüberschreitung beim Werkserweiterungsprojekt',
    scenario: 'Die Inbetriebnahme einer neuen Fertigungslinie liegt 3 Monate hinter dem Zeitplan und weist eine Kostenüberschreitung von 20% auf.',
    options: [
      { id: 'a', score: 3, text: 'Den ausführenden Auftragnehmer kündigen und das Projektteam austauschen.' },
      { id: 'b', score: 2, text: 'Die Projektfristen auf unbestimmte Zeit verlängern, um den operativen Druck zu verringern.' },
      { id: 'c', score: 0, text: 'Einen handlungsfähigen Projektleiter ernennen, Engpässe im kritischen Pfad prüfen, Meilensteine neu definieren und wöchentliche Reviews durchführen.' },
      { id: 'd', score: 1, text: 'Tägliche Stand-up-Meetings ansetzen und mündliche Statusberichte von allen Beteiligten einfordern.' }
    ]
  },
  {
    id: 6,
    dimension: 'execution',
    title: 'Plötzliche operative Krise',
    scenario: 'Ein plötzlicher schwerer Maschinenschaden oder Gefahrstoffaustritt gefährdet die Produktion, die Mitarbeitersicherheit oder den Unternehmensruf.',
    options: [
      { id: 'a', score: 0, text: 'Zuerst die akute Gefahr eindämmen, verifizierte Fakten trennen, Verantwortliche und Maßnahmen festlegen sowie eine Post-Mortem-Analyse einplanen.' },
      { id: 'b', score: 3, text: 'Alle Entscheidungen persönlich an sich reißen und überhastete Notfallbefehle erteilen.' },
      { id: 'c', score: 2, text: 'Entscheidungen aufschieben, bis 100% aller forensischen Daten vorliegen.' },
      { id: 'd', score: 1, text: 'Eine provisorische Behelfslösung anwenden und die Ursachenanalyse auf später vertagen.' }
    ]
  },
  {
    id: 7,
    dimension: 'systems',
    title: 'Lokale Leistungssteigerung einer Einzelstation',
    scenario: 'Eine vorgelagerte Stanzstation steigert ihren Ausstoß um 30%, wodurch sich Zwischenbestände stauen und die nachfolgende Montage verstopfen.',
    options: [
      { id: 'a', score: 3, text: 'Das Stanzteam öffentlich loben und die nachgelagerte Montage antreiben, schneller zu arbeiten.' },
      { id: 'b', score: 2, text: 'Die Geschwindigkeit der Stanzstation wieder auf das historische Niveau drosseln.' },
      { id: 'c', score: 0, text: 'Den gesamten Wertstrom analysieren, den echten Systemengpass identifizieren und am Gesamtdurchsatz der Kette messen.' },
      { id: 'd', score: 1, text: 'Für die Montage vorübergehend Überstunden anordnen und parallel das Ungleichgewicht untersuchen.' }
    ]
  },
  {
    id: 8,
    dimension: 'systems',
    title: 'Kürzungsdruck beim Instandhaltungsbudget',
    scenario: 'Aufgrund kurzfristiger Liquiditätsengpässe wird vorgeschlagen, die präventive Wartung um 30% zu kürzen.',
    options: [
      { id: 'a', score: 3, text: 'Alle nicht-dringenden Wartungsarbeiten sofort stoppen, bis sich der Cashflow erholt.' },
      { id: 'b', score: 2, text: 'Den Instandhaltungsleiter anweisen, pauschal 10% über alle Bereiche hinweg einzusparen.' },
      { id: 'c', score: 0, text: 'Ausfallwahrscheinlichkeiten, Stillstandskosten, Sicherheitsrisiken, Wartungsrückstau und den Gesamteinfluss auf die Produktion analysieren.' },
      { id: 'd', score: 1, text: 'Niedrigrisiko-Wartungen mit definierten Schwellenwerten und festem Wiedervorlagedatum verschieben.' }
    ]
  },
  {
    id: 9,
    dimension: 'systems',
    title: 'Kreditverkauf an Altkunden mit offenen Forderungen',
    scenario: 'Ein langjähriger Stammkunde erteilt einen Großauftrag, hat jedoch erhebliche überfällige Außenstände.',
    options: [
      { id: 'a', score: 2, text: 'Den Verkauf rein auf Basis des jüngsten Transaktionsvolumens genehmigen.' },
      { id: 'b', score: 3, text: 'Auf das persönliche Vertrauen und die langjährige Geschäftsbeziehung bauen.' },
      { id: 'c', score: 0, text: 'Offene Posten, Zahlungsdisziplin, Deckungsbeitrag und die finanzielle Risikotragfähigkeit des Unternehmens prüfen.' },
      { id: 'd', score: 1, text: 'Ein strengeres Kreditlimit setzen und weitere Lieferungen an den Ausgleich der ersten Rate koppeln.' }
    ]
  },
  {
    id: 10,
    dimension: 'memory',
    title: 'Unvorhersehbarer Ausfall einer Schlüsselkraft',
    scenario: 'Ein erfahrener Schichtleiter fällt plötzlich für zwei Wochen im Krankenhaus aus, ohne dass ein Stellvertreter eingearbeitet ist.',
    options: [
      { id: 'a', score: 3, text: 'Ihn fortlaufend auf seinem Privathandy anrufen, um den Betrieb am Laufen zu halten.' },
      { id: 'b', score: 2, text: 'Die Aufgaben nach Bauchgefühl spontan auf verschiedene Mitarbeiter verteilen.' },
      { id: 'c', score: 0, text: 'Auf dokumentierte Standardarbeitsanweisungen (SOPs), Checklisten, Zugriffsrechte und geschulte Stellvertreter zurückgreifen.' },
      { id: 'd', score: 1, text: 'Einen Interim-Leiter benennen und sofort mit der Dokumentation personengebundenen Wissens beginnen.' }
    ]
  },
  {
    id: 11,
    dimension: 'memory',
    title: 'Wiederkehrender Kalibrierungsfehler in der Charge',
    scenario: 'Ein Kalibrierungsfehler in der Produktion tritt trotz mehrfacher Nachschulungen bereits zum dritten Mal im laufenden Jahr auf.',
    options: [
      { id: 'a', score: 3, text: 'Den Mitarbeiter formell abmahnen, um ein hartes disziplinarisches Zeichen zu setzen.' },
      { id: 'b', score: 2, text: 'Exakt dieselbe Schulung noch einmal für alle Beteiligten ansetzen.' },
      { id: 'c', score: 0, text: 'Prozesse, Werkzeuge, Arbeitsanweisungen, Befugnisse, Anreize und Poka-Yoke-Fehlersicherungen systematisch überprüfen.' },
      { id: 'd', score: 1, text: 'Vor und nach der Station eine zusätzliche Zwischenprüfung einführen, während die Ursachen ermittelt werden.' }
    ]
  },
  {
    id: 12,
    dimension: 'memory',
    title: 'Bahnbrechende Prozessverbesserung durch Fachtechniker',
    scenario: 'Ein Instandhaltungstechniker entwickelt eine Methode, die die Rüstzeit von 45 auf 12 Minuten verkürzt.',
    options: [
      { id: 'a', score: 2, text: 'Ihm mündlich danken und den Vorgang damit abschließen.' },
      { id: 'b', score: 1, text: 'Ein Rundschreiben zur internen Information an alle Abteilungen herausgeben.' },
      { id: 'c', score: 3, text: 'Die Durchführung künftig ausschließlich diesem Techniker überlassen, da er sich am besten auskennt.' },
      { id: 'd', score: 0, text: 'Die Methode dokumentieren, erproben, standardisieren, alle Schichten schulen und KPIs zur Nachhaltigkeit etablieren.' }
    ]
  },
  {
    id: 13,
    dimension: 'culture',
    title: 'Verbesserungsvorschlag eines Werkstattmitarbeiters',
    scenario: 'Ein Mitarbeiter an der Linie schlägt eine Anpassung beim Blechzuschnitt vor, die den Ausschuss um 10% senken soll.',
    options: [
      { id: 'a', score: 0, text: 'Den Vorschlag prüfen, im Pilotversuch testen, Ergebnisse transparent kommunizieren und den geschaffenen Mehrwert prämieren.' },
      { id: 'b', score: 2, text: 'Ihn auffordern, die Idee formell im betrieblichen Vorschlagswesen einzureichen.' },
      { id: 'c', score: 1, text: 'Nach eigenem Manager-Bauchgefühl entscheiden, ob sich die Idee lohnt.' },
      { id: 'd', score: 3, text: 'Den Mitarbeitern klarmachen, dass Prozessoptimierung Sache der Ingenieure und Führungskräfte ist.' }
    ]
  },
  {
    id: 14,
    dimension: 'culture',
    title: 'Ehrliche Fehlermeldung vor der Auslieferung',
    scenario: 'Ein Mitarbeiter meldet einen eigenen Mischungsfehler unmittelbar vor der Auslieferung, wodurch Millionenschäden beim Kunden vermieden werden.',
    options: [
      { id: 'a', score: 3, text: 'Den Mitarbeiter hart bestrafen, um zu signalisieren, dass Fehler nicht toleriert werden.' },
      { id: 'b', score: 0, text: 'Die proaktive Meldung anerkennen, den Schaden begrenzen und klar zwischen ehrlichem Irrtum und Vorsatz unterscheiden.' },
      { id: 'c', score: 2, text: 'Den Vorfall intern verschweigen, um den Mitarbeiter vor Konsequenzen zu schützen.' },
      { id: 'd', score: 1, text: 'Eine informelle mündliche Ermahnung aussprechen und die Sache auf sich beruhen lassen.' }
    ]
  },
  {
    id: 15,
    dimension: 'culture',
    title: 'Vertriebsprovisionen vs. Zahlungsausfälle und Retouren',
    scenario: 'Umsatzprovisionen führen zu Rekordaufträgen, gleichzeitig steigen überfällige Forderungen, geplatzte Schecks und Retouren massiv an.',
    options: [
      { id: 'a', score: 3, text: 'Die Vertriebsziele weiter erhöhen, um die Liquiditätslücken durch noch mehr Volumen auszugleichen.' },
      { id: 'b', score: 2, text: 'Das bisherige Provisionsmodell beibehalten und die Verkäufer mündlich zur Zahlungseintreibung ermahnen.' },
      { id: 'c', score: 0, text: 'Das Vergütungssystem auf profitablen, tatsächlich realisierten Zahlungseingang, niedrige Retouren und Kundenbonität umstellen.' },
      { id: 'd', score: 1, text: 'Alle risikobehafteten Verkäufe unter den Genehmigungsvorbehalt des Geschäftsführers stellen.' }
    ]
  },
  {
    id: 16,
    dimension: 'data',
    title: 'Hohes Produktionsvolumen bei steigenden Reklamationen',
    scenario: 'Das Dashboard meldet 20% mehr Produktionsmenge, gleichzeitig erreichen Ausschussquoten und Kundenreklamationen historische Höchststände.',
    options: [
      { id: 'a', score: 3, text: 'Das Produktionswachstum feiern und Reklamationen isoliert im Kundenservice abarbeiten.' },
      { id: 'b', score: 2, text: 'Der QS-Abteilung die Schuld geben, weil sie mit dem schnellen Tempo der Linie nicht Schritt hält.' },
      { id: 'c', score: 0, text: 'Die Datenvalidität auditieren und fehlerfreie Ausbringung, Ausschuss, Retouren, Margen und Kundenreklamationen gemeinsam bewerten.' },
      { id: 'd', score: 1, text: 'Das Produktionsvolumen drosseln, bis die Ursachen geklärt sind.' }
    ]
  },
  {
    id: 17,
    dimension: 'data',
    title: 'Empfehlung eines KI- oder Analysesystems',
    scenario: 'Ein automatisiertes Risikoprüfungssystem empfiehlt, einem langjährigen, wichtigen Großhändler den Warenkredit zu sperren.',
    options: [
      { id: 'a', score: 3, text: 'Die Empfehlung blind ausführen, da Algorithmen mehr Daten verarbeiten als Menschen.' },
      { id: 'b', score: 2, text: 'Das System ignorieren und die Freigabe nach persönlichem Gefühl erteilen.' },
      { id: 'c', score: 0, text: 'Die Systemdaten und Modellannahmen prüfen und die finale Entscheidung unter klarer menschlicher Verantwortung treffen.' },
      { id: 'd', score: 1, text: 'Die Entscheidung an den Finanzchef delegieren und abzeichnen lassen.' }
    ]
  },
  {
    id: 18,
    dimension: 'data',
    title: 'Widersprüchliche Kennzahlen zwischen Abteilungen',
    scenario: 'Finanzen, Vertrieb und Lager präsentieren drei völlig unterschiedliche Zahlen zur Bestandsbewertung.',
    options: [
      { id: 'a', score: 3, text: 'Die Zahl des Finanzleiters akzeptieren, da er die höhere hierarchische Position hat.' },
      { id: 'b', score: 2, text: 'Den mathematischen Mittelwert der drei Werte als Arbeitsgrundlage heranziehen.' },
      { id: 'c', score: 0, text: 'Kennzahlendefinitionen, Datenquellen (Single Source of Truth), Erfassungszeitpunkte und Ursachen der Abweichungen harmonisieren.' },
      { id: 'd', score: 1, text: 'Eine konservative Schätzung ansetzen und eine feste Frist zur Datenbereinigung setzen.' }
    ]
  },
  {
    id: 19,
    dimension: 'operations',
    title: 'Umsatzsteigerung bei schrumpfender operativer Marge',
    scenario: 'Der Umsatz ist um 25% gestiegen, doch die operative Marge und die Bankguthaben schrumpfen kontinuierlich.',
    options: [
      { id: 'a', score: 3, text: 'Produktion und Vertrieb weiter hochfahren, um die Fixkosten über die Menge zu strecken.' },
      { id: 'b', score: 2, text: 'Pauschal alle Produktpreise im Katalog um 10% erhöhen.' },
      { id: 'c', score: 0, text: 'Deckungsbeiträge nach SKU, Kundensegment, Linie, Ausschuss, Rabattstaffeln und Zahlungszielen tiefenanalysieren.' },
      { id: 'd', score: 1, text: 'Die Fertigung unprofitabler Artikel stoppen, während die Gesamtanalyse läuft.' }
    ]
  },
  {
    id: 20,
    dimension: 'operations',
    title: 'Chronischer optischer Mangel aus Gewohnheit',
    scenario: 'An den Fertigprodukten tritt seit Jahren ein kleiner optischer Makel auf, den die Belegschaft mit den Worten „Das war schon immer so“ abtut.',
    options: [
      { id: 'a', score: 3, text: 'Den Fehler ignorieren, solange keine formellen Kundenbeschwerden eingehen.' },
      { id: 'b', score: 2, text: 'Die Anzahl der Endprüfer in der Qualitätskontrolle erhöhen.' },
      { id: 'c', score: 0, text: 'Die Ursache im vorgelagerten Prozess ermitteln, gezielte Anpassungen vornehmen und Standards aktualisieren.' },
      { id: 'd', score: 1, text: 'Betroffene Chargen aussortieren und eine Frist für eine technische Überprüfung setzen.' }
    ]
  },
  {
    id: 21,
    dimension: 'operations',
    title: 'Wiederkehrende 5-minütige Mikrostopps',
    scenario: 'Die Hauptproduktionslinie stoppt pro Schicht 6 bis 8 Mal für jeweils ca. 5 Minuten, was von den Mitarbeitern als normal empfunden wird.',
    options: [
      { id: 'a', score: 3, text: 'Da die Stopps kurz sind, als unbedeutend einstufen und ignorieren.' },
      { id: 'b', score: 2, text: 'Den Produktionsausfall durch Wochenend-Überstunden ausgleichen.' },
      { id: 'c', score: 0, text: 'Häufigkeit, Dauer, Ursachen und kumulierte Kosten erfassen und deren Hebelwirkung auf den Engpass messen.' },
      { id: 'd', score: 1, text: 'Eine temporäre Pufferlinie einrichten und der Instandhaltung eine feste Behebungsfrist setzen.' }
    ]
  },
  {
    id: 22,
    dimension: 'market',
    title: 'Aggressive Rabattforderung eines Großhändlers',
    scenario: 'Ein wichtiger Großhändler fordert ultimativ 15% Sonderrabatt und droht andernfalls mit dem sofortigen Wechsel zum Wettbewerb.',
    options: [
      { id: 'a', score: 2, text: 'Den Rabatt sofort gewähren, um das Absatzvolumen nicht zu verlieren.' },
      { id: 'b', score: 1, text: 'Die Forderung brüsk ablehnen, um das Preisgefüge des Unternehmens zu verteidigen.' },
      { id: 'c', score: 0, text: 'Wechselkosten des Kunden, wahrgenommenen Wert, Deckungsbeitrag, Zahlungskonditionen und nicht-monetäre Mehrwerte prüfen.' },
      { id: 'd', score: 3, text: 'Den Rabatt geben, aber Serviceumfang oder Produktqualität unbemerkt reduzieren.' }
    ]
  },
  {
    id: 23,
    dimension: 'market',
    title: 'Großauftrag von Kunden mit schlechter Zahlungsmoral',
    scenario: 'Ein Großkunde mit notorisch schleppender Zahlungsmoral platziert einen Großauftrag mit rechnerisch hoher Marge.',
    options: [
      { id: 'a', score: 3, text: 'Den Auftrag sofort annehmen; Umsatzwachstum nützt dem Unternehmen immer.' },
      { id: 'b', score: 1, text: 'Den Auftrag ohne weitere Verhandlungen sofort ablehnen.' },
      { id: 'c', score: 0, text: 'Deckungsbeitrag, Kapazitätsauslastung, Zahlungshistorie und Sicherheiten prüfen und Anzahlungen oder Meilenstein-Lieferungen vereinbaren.' },
      { id: 'd', score: 2, text: 'Den Auftrag per Handschlag und mündlicher Zusage des Vertriebsleiters annehmen.' }
    ]
  },
  {
    id: 24,
    dimension: 'market',
    title: 'Unrealistisches Lieferversprechen zum Vertragsabschluss',
    scenario: 'Ein Wunschkunde verlangt die Lieferung in der halben Standardzeit, obwohl das Werk bereits zu 100% ausgelastet ist.',
    options: [
      { id: 'a', score: 3, text: 'Die unlösbare Lieferfrist zusagen und die Fabrik anschließend unter extremen Druck setzen.' },
      { id: 'b', score: 1, text: 'Das Angebot sofort ablehnen und jede weitere Verhandlung verweigern.' },
      { id: 'c', score: 0, text: 'Reale Kapazitäten transparent darlegen, verlässliche Stufenpläne oder priorisierte Teillieferungen anbieten.' },
      { id: 'd', score: 2, text: 'Dem Kunden sagen, „wir versuchen unser Bestes“, und auf glückliche Umstände hoffen.' }
    ]
  }
];

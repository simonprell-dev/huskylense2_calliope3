# HUSKYLENS 2 für Calliope mini 3

Dies ist eine schlanke MakeCode-Erweiterung für **HUSKYLENS 2** mit Fokus auf
**Calliope mini 3** (I2C).

## Installation in MakeCode (Calliope)

1. Öffne den Calliope-MakeCode-Editor:  
   **https://makecode.calliope.cc/**
2. Erstelle ein neues Projekt oder öffne ein bestehendes Projekt.
3. Klicke links auf **Erweitert** → **Erweiterungen**.
4. Füge in das Suchfeld die Repository-URL ein (oder `owner/repo`):
   - `https://github.com/<DEIN-ACCOUNT>/huskylense2_calliope3`
5. Wähle die Erweiterung aus der Ergebnisliste aus.
6. Nach dem Import erscheinen die Blöcke unter **HUSKYLENS2**.

> Hinweis: Für lokale Tests in einem Fork/Branch muss die URL auf dein tatsächliches
> GitHub-Repository zeigen.

## Was wurde gegenüber dem Original angepasst?

- `targetId` und `supportedTargets` sind auf `calliopemini` gesetzt.
- API und Blocknamen sind auf Calliope/MakeCode-Nutzung abgestimmt.
- Fokus auf robuste I2C-Basisfunktionen (`I2CInit`, `knock`, `switchAlgorithm`, `request`).


## Verfügbare Blöcke (Deutsch)

- **Setup**: `I2C initialisieren`, `Verbindung testen`, `Algorithmus wählen`
- **Erkennung**: `Ergebnisse aktualisieren`, `Objekt erkannt`, `Anzahl Objekte`
- **Werte**: `Eigenschaft`, `ID`, `X-Mitte`, `Y-Mitte`, `Breite`, `Höhe`

## Schnellstart

```typescript
huskylens2.I2CInit()
huskylens2.switchAlgorithm(huskylens2.Algorithm.FaceRecognition)

basic.forever(function () {
    huskylens2.request()
    if (huskylens2.available()) {
        serial.writeLine("ID: " + huskylens2.cachedCenterResult(huskylens2.BasePropertyId.Id))
        serial.writeLine("X: " + huskylens2.cachedCenterResult(huskylens2.BasePropertyId.XCenter))
        serial.writeLine("Y: " + huskylens2.cachedCenterResult(huskylens2.BasePropertyId.YCenter))
    }
    basic.pause(100)
})
```

## Hinweis

Je nach HUSKYLENS-2-Firmware kann sich das exakte Antwortformat unterscheiden.
Die Implementierung enthält bewusst einen konservativen Parser für den ersten
Erkennungsblock.

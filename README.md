# HUSKYLENS 2 für Calliope mini 3

Dies ist eine schlanke MakeCode-Erweiterung für **HUSKYLENS 2** mit Fokus auf
**Calliope mini 3** (I2C).

## Was wurde gegenüber dem Original angepasst?

- `targetId` und `supportedTargets` sind auf `calliopemini` gesetzt.
- API und Blocknamen sind auf Calliope/MakeCode-Nutzung abgestimmt.
- Fokus auf robuste I2C-Basisfunktionen (`I2CInit`, `knock`, `switchAlgorithm`, `request`).

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

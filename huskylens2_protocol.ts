/**
 * HUSKYLENS 2 - Calliope mini 3 compatible port (I2C)
 */

//% color=#2E86DE icon="\uf085" block="HUSKYLENS2"
namespace huskylens2 {
    const HEADER = 0x55
    const HEADER2 = 0xAA
    const ADDRESS = 0x11
    const DEFAULT_I2C_ADDR = 0x32

    let i2cAddr = DEFAULT_I2C_ADDR

    export enum Algorithm {
        //% block="Gesichtserkennung"
        FaceRecognition = 0,
        //% block="Objektverfolgung"
        ObjectTracking = 1,
        //% block="Objekterkennung"
        ObjectRecognition = 2,
        //% block="Linienverfolgung"
        LineTracking = 3,
        //% block="Farb-Erkennung"
        ColorRecognition = 4,
        //% block="Tag-Erkennung"
        TagRecognition = 5,
        //% block="Objektklassifikation"
        ObjectClassification = 6,
        //% block="Pose-Erkennung"
        PoseRecognition = 7
    }

    export enum BasePropertyId {
        Id = 0,
        XCenter = 1,
        YCenter = 2,
        Width = 3,
        Height = 4
    }

    let lastCount = 0
    let centerResult: number[] = [0, 0, 0, 0, 0]

    function checksum(buf: Buffer): number {
        let sum = 0
        for (let i = 0; i < buf.length; i++) sum += buf[i]
        return sum & 0xFF
    }

    function writeCommand(cmd: number, payload?: Buffer) {
        const payloadLen = payload ? payload.length : 0
        const packet = pins.createBuffer(6 + payloadLen)
        packet[0] = HEADER
        packet[1] = HEADER2
        packet[2] = ADDRESS
        packet[3] = payloadLen
        packet[4] = cmd
        for (let i = 0; i < payloadLen; i++) packet[5 + i] = payload[i]
        packet[5 + payloadLen] = checksum(packet.slice(0, 5 + payloadLen))
        pins.i2cWriteBuffer(i2cAddr, packet, false)
    }

    function readPacket(maxLen: number = 32): Buffer {
        const buf = pins.i2cReadBuffer(i2cAddr, maxLen, false)
        return buf
    }

    function parseFirstBlock(buf: Buffer): boolean {
        // Minimal parser for a single block result.
        // Format differs by firmware; this parser targets standard HUSKYLENS block fields.
        if (buf.length < 20) return false

        for (let i = 0; i < buf.length - 12; i++) {
            if (buf[i] == HEADER && buf[i + 1] == HEADER2 && buf[i + 2] == ADDRESS) {
                // heuristic parse positions
                centerResult[BasePropertyId.XCenter] = buf[i + 6] | (buf[i + 7] << 8)
                centerResult[BasePropertyId.YCenter] = buf[i + 8] | (buf[i + 9] << 8)
                centerResult[BasePropertyId.Width] = buf[i + 10] | (buf[i + 11] << 8)
                centerResult[BasePropertyId.Height] = buf[i + 12] | (buf[i + 13] << 8)
                centerResult[BasePropertyId.Id] = buf[i + 14] | (buf[i + 15] << 8)
                return true
            }
        }

        return false
    }

    /**
     * Initialisiert HUSKYLENS 2 über I2C (Standardadresse 0x32).
     */
    //% block="HUSKYLENS2 I2C initialisieren (Adresse $addr)"
    //% addr.min=1 addr.max=127 addr.defl=0x32
    export function I2CInit(addr: number = DEFAULT_I2C_ADDR) {
        i2cAddr = addr
        basic.pause(50)
        knock()
    }

    /**
     * Testet die Verbindung zu HUSKYLENS 2.
     */
    //% block="HUSKYLENS2 Verbindung testen"
    export function knock(): boolean {
        writeCommand(0x2C)
        basic.pause(20)
        const resp = readPacket(16)
        return resp.length >= 6 && resp[0] == HEADER && resp[1] == HEADER2
    }

    /**
     * Wechselt den Algorithmus in HUSKYLENS 2.
     */
    //% block="HUSKYLENS2 Algorithmus $algo wählen"
    export function switchAlgorithm(algo: Algorithm) {
        const p = pins.createBuffer(2)
        p[0] = algo & 0xFF
        p[1] = (algo >> 8) & 0xFF
        writeCommand(0x2D, p)
        basic.pause(50)
    }

    /**
     * Holt Ergebnisse der aktuellen Erkennung.
     */
    //% block="HUSKYLENS2 Ergebnisse aktualisieren"
    export function request() {
        writeCommand(0x20)
        basic.pause(30)
        const resp = readPacket(32)
        if (parseFirstBlock(resp)) {
            lastCount = 1
        } else {
            lastCount = 0
        }
    }

    /**
     * Gibt zurück, ob mindestens ein Objekt erkannt wurde.
     */
    //% block="HUSKYLENS2 Objekt erkannt"
    export function available(): boolean {
        return lastCount > 0
    }

    /**
     * Liefert Eigenschaften des ersten erkannten Objekts.
     */
    //% block="HUSKYLENS2 Eigenschaft $property"
    export function cachedCenterResult(property: BasePropertyId): number {
        return centerResult[property]
    }
}

declare type Buffer = any

declare namespace pins {
  function createBuffer(length: number): Buffer
  function i2cWriteBuffer(addr: number, buf: Buffer, repeat?: boolean): void
  function i2cReadBuffer(addr: number, size: number, repeat?: boolean): Buffer
}

declare namespace basic {
  function pause(ms: number): void
  function showIcon(icon: any): void
  function showString(text: string): void
  function forever(body: () => void): void
  function clearScreen(): void
  function showArrow(direction: any): void
}

declare namespace serial {
  function writeLine(text: string): void
}

declare const IconNames: any
declare const ArrowNames: any

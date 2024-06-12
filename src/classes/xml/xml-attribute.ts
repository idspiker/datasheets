import { XMLable } from './xmlable';

export class XMLAttribute implements XMLable {
  key: string;
  value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }

  toXML(): string {
    return `${this.key}="${this.value}"`;
  }
}

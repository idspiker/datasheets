import { XMLable } from './xmlable';

export class XMLText implements XMLable {
  value: string;

  constructor(value: string) {
    this.value = value;
  }

  toXML() {
    return this.value;
  }
}

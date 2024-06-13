import { XMLable } from './xmlable';

export class XMLAttributes implements XMLable {
  private attributes: Map<string, string>;

  constructor() {
    this.attributes = new Map();
  }

  addAttribute(key: string, value: string) {
    this.attributes.set(key, value);
  }

  get(key: string): string | undefined {
    return this.attributes.get(key);
  }

  toXML(): string {
    let attributesXML = '';

    for (const [key, value] of this.attributes) {
      attributesXML += ' ' + `${key}="${value}"`;
    }

    return attributesXML;
  }
}

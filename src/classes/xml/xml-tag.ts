import { XMLable } from './xmlable';
import { XMLAttribute } from './xml-attribute';
import { XMLText } from './xml-text';

export class XMLTag implements XMLable {
  tagName: string;
  attributes: XMLAttribute[];
  children: Array<XMLTag | XMLText>;
  selfClosing: boolean;

  constructor(
    tagName: string,
    attributes: XMLAttribute[] = [],
    children: Array<XMLTag | XMLText> = [],
    selfClosing: boolean = false
  ) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.children = children;
    this.selfClosing = selfClosing;
  }

  getAttributeValue(key: string): string | undefined {
    for (const attrib of this.attributes) {
      if (attrib.key === key) return attrib.value;
    }

    return undefined;
  }

  toXML(): string {
    if (this.selfClosing) {
      return this.makeSelfClosingTag();
    }

    const children = this.children.map((child) => child.toXML());
    const tags = this.makeTags();

    return tags.opening + children.join('') + tags.closing;
  }

  private makeTags(): { opening: string; closing: string } {
    let opening = `<${this.tagName}`;

    for (const attrib of this.attributes) {
      opening += ' ' + attrib.toXML();
    }

    opening += '>';

    const closing = `</${this.tagName}>`;

    return { opening, closing };
  }

  private makeSelfClosingTag(): string {
    let tag = `<${this.tagName}`;

    for (const attrib of this.attributes) {
      tag += ' ' + attrib.toXML();
    }

    tag += '/>';

    return tag;
  }
}

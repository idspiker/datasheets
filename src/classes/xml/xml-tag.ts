import { XMLable } from './xmlable';
import { XMLText } from './xml-text';
import { XMLAttributes } from './xml-attributes';

export class XMLTag implements XMLable {
  tagName: string;
  attributes: XMLAttributes;
  children: Array<XMLTag | XMLText>;
  selfClosing: boolean;

  constructor(
    tagName: string,
    attributes: XMLAttributes,
    children: Array<XMLTag | XMLText> = [],
    selfClosing: boolean = false
  ) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.children = children;
    this.selfClosing = selfClosing;
  }

  getAttributeValue(key: string): string | undefined {
    return this.attributes.get(key);
  }

  hasAttribute(key: string): boolean {
    return this.getAttributeValue(key) !== undefined;
  }

  toXML(): string {
    if (this.selfClosing) {
      return this.makeSelfClosingTag();
    }

    const children = this.children.map((child) => child.toXML());
    const tags = this.makeTags();

    return tags.opening + children.join('') + tags.closing;
  }

  hasNameOf(name: string): boolean {
    return this.tagName === name;
  }

  private makeTags(): { opening: string; closing: string } {
    const opening = `<${this.tagName}${this.attributes.toXML()}>`;

    const closing = `</${this.tagName}>`;

    return { opening, closing };
  }

  private makeSelfClosingTag(): string {
    return `<${this.tagName}${this.attributes}/>`;
  }
}

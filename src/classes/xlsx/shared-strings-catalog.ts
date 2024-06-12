import { ParsedXMLTree } from '../../app/xml.service';
import { XMLTag } from '../xml/xml-tag';
import { XMLText } from '../xml/xml-text';

export class SharedStringsCatalog {
  sharedStrings: string[];

  constructor(xmlTree: ParsedXMLTree) {
    this.sharedStrings = this.parseSharedStrings(xmlTree);
  }

  get(key: number | string): string | undefined {
    const index = Number(key);

    if (Number.isNaN(index)) return undefined;

    return this.sharedStrings[index];
  }

  private parseSharedStrings(xmlTree: ParsedXMLTree): string[] {
    if (!xmlTree.root) return [];

    const stringTags = xmlTree.root.children;

    const strings: string[] = [];

    for (const [index, stringTag] of stringTags.entries()) {
      if (stringTag instanceof XMLText) continue;

      const stringValue = this.getStringValue(stringTag);

      if (!stringValue) continue;

      strings[index] = stringValue;
    }

    return strings;
  }

  private getStringValue(stringTag: XMLTag): string | undefined {
    if (!stringTag.hasNameOf('si')) return undefined;

    const stringTagInner = stringTag.children[0];
    if (stringTagInner instanceof XMLText) return undefined;

    if (!stringTagInner.hasNameOf('t')) return undefined;

    const stringNode = stringTagInner.children[0];

    if (stringNode instanceof XMLText) {
      return stringNode.value;
    }

    return undefined;
  }
}

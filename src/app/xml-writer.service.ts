import { Injectable } from '@angular/core';

import { ParsedXMLNode, ParsedXMLTree, XMLAttribute } from './xml.service';

@Injectable({
  providedIn: 'root',
})
export class XmlWriterService {
  writeXML(xmlTree: ParsedXMLTree): string {
    const xmlHeader = this.makeXMLHeader(xmlTree);
    if (!xmlTree.root) {
      return xmlHeader;
    }

    const stringifiedXML = this.stringifyXMLNode(xmlTree.root);

    return xmlHeader + stringifiedXML;
  }

  private stringifyXMLNode(node: ParsedXMLNode | string): string {
    if (typeof node === 'string') {
      return node;
    }

    if (node.selfClosing) {
      return this.makeSelfClosingTag(node);
    }

    const childTags = node.children.map((tag) => this.stringifyXMLNode(tag));
    const content = childTags.join('');

    const tag = this.makeOpeningTag(node) + content + this.makeClosingTag(node);

    return tag;
  }

  private makeXMLHeader(xmlTree: ParsedXMLTree): string {
    let tag = '<?xml';

    for (const attrib of xmlTree.attributes) {
      tag += ' ' + this.makeAttribute(attrib);
    }

    tag += '?>';

    return tag;
  }

  private makeAttribute(attributeData: XMLAttribute): string {
    return `${attributeData.key}="${attributeData.value}"`;
  }

  private makeOpeningTag(tagData: ParsedXMLNode): string {
    let tag = `<${tagData.tagName}`;

    for (const attrib of tagData.attributes) {
      tag += ' ' + this.makeAttribute(attrib);
    }

    tag += '>';

    return tag;
  }

  private makeSelfClosingTag(tagData: ParsedXMLNode): string {
    let tag = `<${tagData.tagName}`;

    for (const attrib of tagData.attributes) {
      tag += ' ' + this.makeAttribute(attrib);
    }

    tag += '/>';

    return tag;
  }

  private makeClosingTag(tagData: ParsedXMLNode): string {
    return `</${tagData.tagName}>`;
  }
}

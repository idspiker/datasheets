import { Injectable } from '@angular/core';

interface ParsedXMLNode {
  tagName: string;
  attributes: XMLAttribute[];
  children: Array<ParsedXMLNode | string>;
}

interface XMLAttribute {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class XmlReaderService {
  private xmlHeaderTag = /^<\?xml(?:\s?(?:[a-zA-Z0-9_\-\.]+="[^"]+"))*\?>/;
  private openingTag =
    /^<([a-zA-Z0-9_\-\.]+)(?:\s(?:[a-zA-Z0-9_\-:\.]+="[^"]+"))*>/;
  private closingTag = /^<\/([a-zA-Z0-9_\-\.]+)>/;
  private selfClosingTag =
    /^<([a-zA-Z0-9_\-\.]+)(?:\s?(?:[a-zA-Z0-9_\-:\.]+="[^"]+"))*\/>/;
  private xmlAttribute = /([a-zA-Z0-9_\-:\.]+="[^"]+")/g;

  constructor() {}

  readXML(xml: string): ParsedXMLNode | undefined {
    xml = xml.replace(this.xmlHeaderTag, '');
    xml = xml.trim();

    return this.parseXMLTree(xml);

    /*
      - remove xml tag
      - while string is not empty
        - get next tag
        - if tag is opening
          - parse tag
          - add reference to top of stack's children array (if stack not empty)
          - push to stack
        - if tag is closing
          - if tag matches top of stack
            - pop top of stack
          - else
            - throw error
        - if tag is self-closing
          - parse and add to top of stack's children array

        - else
          - get all text till the next tag
          - create text node and add it to the top of stack's children list
        
        - remove tag from string
    */
  }

  private parseXMLTree(xml: string): ParsedXMLNode | undefined {
    let rootNode = undefined;
    const parsingStack: ParsedXMLNode[] = [];

    while (xml.length !== 0) {
      const openingTagMatch = xml.match(this.openingTag);
      if (openingTagMatch) {
        const tagObj = {
          tagName: openingTagMatch[1],
          attributes: this.getXMLAttributes(openingTagMatch[0]),
          children: [],
        };

        if (parsingStack.length === 0) {
          rootNode = tagObj;
          parsingStack.push(tagObj);
        } else {
          parsingStack[parsingStack.length - 1].children.push(tagObj);
          parsingStack.push(tagObj);
        }

        xml = xml.slice(openingTagMatch[0].length);
        xml = xml.trim();
        continue;
      }

      const closingTagMatch = xml.match(this.closingTag);
      if (closingTagMatch) {
        if (parsingStack.length === 0) throw new Error('Invalid closing tag');

        const topTag = parsingStack.at(-1);

        if (topTag && closingTagMatch[1] === topTag.tagName) {
          parsingStack.pop();
        }

        xml = xml.slice(closingTagMatch[0].length);
        xml = xml.trim();
        continue;
      }

      const selfClosingTagMatch = xml.match(this.selfClosingTag);
      if (selfClosingTagMatch) {
        const tagObj = {
          tagName: selfClosingTagMatch[1],
          attributes: this.getXMLAttributes(selfClosingTagMatch[0]),
          children: [],
        };

        parsingStack[parsingStack.length - 1].children.push(tagObj);

        xml = xml.slice(selfClosingTagMatch[0].length);
        xml = xml.trim();
        continue;
      }

      // Handle text node
      const indexOfNextTag = xml.indexOf('<');
      const value = xml.slice(0, indexOfNextTag).trim();
      xml = xml.slice(indexOfNextTag);
      xml = xml.trim();
      parsingStack[parsingStack.length - 1].children.push(value);

      if (parsingStack.length === 0) break;
    }

    return rootNode;
  }

  private getXMLAttributes(tag: string): XMLAttribute[] {
    const attributesMatch = tag.matchAll(this.xmlAttribute);

    const attributes: XMLAttribute[] = [];
    for (const attrib of attributesMatch) {
      const splitAttribute = String(attrib[0]).split('=');

      const attributeObject = {
        key: splitAttribute[0],
        value: splitAttribute[1].slice(1, -1),
      };

      attributes.push(attributeObject);
    }

    return attributes;
  }
}

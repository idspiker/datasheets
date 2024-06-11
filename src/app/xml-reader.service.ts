import { Injectable } from '@angular/core';

import { ParsedXMLNode, ParsedXMLTree, XMLAttribute } from './xml.service';

@Injectable({
  providedIn: 'root',
})
export class XmlReaderService {
  private xmlHeaderTag = /^<\?xml(?:\s?(?:[a-zA-Z0-9_\-\.]+="[^"]+"))*\?>/;
  private openingTag =
    /^<([a-zA-Z0-9_\-:\.]+)(?:\s(?:[a-zA-Z0-9_\-:\.]+="[^"]+"))*>/;
  private closingTag = /^<\/([a-zA-Z0-9_\-:\.]+)>/;
  private selfClosingTag =
    /^<([a-zA-Z0-9_\-:\.]+)(?:\s?(?:[a-zA-Z0-9_\-:\.]+="[^"]+"))*\/>/;
  private xmlAttribute = /([a-zA-Z0-9_\-:\.]+="[^"]+")/g;

  readXML(xmlString: string): ParsedXMLTree {
    const xmlHeader = xmlString.match(this.xmlHeaderTag);

    xmlString = xmlString.replace(this.xmlHeaderTag, '');
    xmlString = xmlString.trim();

    if (!xmlHeader) {
      return {
        attributes: [],
        root: undefined,
      };
    }

    return {
      attributes: this.getXMLAttributes(xmlHeader[0]),
      root: this.parseXMLTree(xmlString),
    };

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

  private parseXMLTree(xmlString: string): ParsedXMLNode | undefined {
    let rootNode = undefined;
    const parsingStack: ParsedXMLNode[] = [];

    while (xmlString.length !== 0) {
      const openingTagMatch = xmlString.match(this.openingTag);
      if (openingTagMatch) {
        const tagObj = {
          tagName: openingTagMatch[1],
          attributes: this.getXMLAttributes(openingTagMatch[0]),
          children: [],
          selfClosing: false,
        };

        if (parsingStack.length === 0) {
          rootNode = tagObj;
          parsingStack.push(tagObj);
        } else {
          parsingStack[parsingStack.length - 1].children.push(tagObj);
          parsingStack.push(tagObj);
        }

        xmlString = xmlString.slice(openingTagMatch[0].length);
        xmlString = xmlString.trim();
        continue;
      }

      const closingTagMatch = xmlString.match(this.closingTag);
      if (closingTagMatch) {
        if (parsingStack.length === 0) throw new Error('Invalid closing tag');

        const topTag = parsingStack.at(-1);

        if (topTag && closingTagMatch[1] === topTag.tagName) {
          parsingStack.pop();
        }

        xmlString = xmlString.slice(closingTagMatch[0].length);
        xmlString = xmlString.trim();
        continue;
      }

      const selfClosingTagMatch = xmlString.match(this.selfClosingTag);
      if (selfClosingTagMatch) {
        const tagObj = {
          tagName: selfClosingTagMatch[1],
          attributes: this.getXMLAttributes(selfClosingTagMatch[0]),
          children: [],
          selfClosing: true,
        };

        if (parsingStack.length === 0) {
          rootNode = tagObj;
          break;
        }

        parsingStack[parsingStack.length - 1].children.push(tagObj);

        xmlString = xmlString.slice(selfClosingTagMatch[0].length);
        xmlString = xmlString.trim();
        continue;
      }

      if (parsingStack.length === 0) break;

      // Handle text node
      const indexOfNextTag = xmlString.indexOf('<');
      const value = xmlString.slice(0, indexOfNextTag).trim();
      xmlString = xmlString.slice(indexOfNextTag);
      xmlString = xmlString.trim();
      parsingStack[parsingStack.length - 1].children.push(value);
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

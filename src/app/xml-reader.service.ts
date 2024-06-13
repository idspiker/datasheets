import { Injectable } from '@angular/core';

import { ParsedXMLTree } from './xml.service';
import { XMLTag } from '../classes/xml/xml-tag';
import { XMLText } from '../classes/xml/xml-text';
import { XMLAttributes } from '../classes/xml/xml-attributes';

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
        attributes: new XMLAttributes(),
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

  private parseXMLTree(xmlString: string): XMLTag | undefined {
    let rootNode = undefined;
    const parsingStack: XMLTag[] = [];

    while (xmlString.length !== 0) {
      const openingTagMatch = xmlString.match(this.openingTag);
      if (openingTagMatch) {
        const tag = new XMLTag(
          openingTagMatch[1],
          this.getXMLAttributes(openingTagMatch[0])
        );

        if (parsingStack.length === 0) {
          rootNode = tag;
          parsingStack.push(tag);
        } else {
          parsingStack[parsingStack.length - 1].children.push(tag);
          parsingStack.push(tag);
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
        const tag = new XMLTag(
          selfClosingTagMatch[1],
          this.getXMLAttributes(selfClosingTagMatch[0]),
          [],
          true
        );

        if (parsingStack.length === 0) {
          rootNode = tag;
          break;
        }

        parsingStack[parsingStack.length - 1].children.push(tag);

        xmlString = xmlString.slice(selfClosingTagMatch[0].length);
        xmlString = xmlString.trim();
        continue;
      }

      if (parsingStack.length === 0) break;

      // Handle text node
      const indexOfNextTag = xmlString.indexOf('<');
      const value = new XMLText(xmlString.slice(0, indexOfNextTag).trim());
      xmlString = xmlString.slice(indexOfNextTag);
      xmlString = xmlString.trim();
      parsingStack[parsingStack.length - 1].children.push(value);
    }

    return rootNode;
  }

  private getXMLAttributes(tag: string): XMLAttributes {
    const attributesMatch = tag.matchAll(this.xmlAttribute);

    const attributes: XMLAttributes = new XMLAttributes();
    for (const attrib of attributesMatch) {
      const splitAttribute = String(attrib[0]).split('=');

      attributes.addAttribute(
        splitAttribute[0],
        splitAttribute[1].slice(1, -1)
      );
    }

    return attributes;
  }
}

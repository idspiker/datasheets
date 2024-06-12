import { Injectable } from '@angular/core';

import { ParsedXMLTree } from './xml.service';
import { XMLTag } from '../classes/xml/xml-tag';

@Injectable({
  providedIn: 'root',
})
export class XmlWriterService {
  writeXML(xmlTree: ParsedXMLTree): string {
    const xmlHeader = this.makeXMLHeader(xmlTree);
    if (!xmlTree.root) {
      return xmlHeader;
    }

    const stringifiedXML = xmlTree.root.toXML();

    return xmlHeader + stringifiedXML;
  }

  private makeXMLHeader(xmlTree: ParsedXMLTree): string {
    let tag = '<?xml';

    for (const attrib of xmlTree.attributes) {
      tag += ' ' + attrib.toXML();
    }

    tag += '?>';

    return tag;
  }
}

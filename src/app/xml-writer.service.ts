import { Injectable } from '@angular/core';

import { ParsedXMLTree } from './xml.service';

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
    return `<?xml${xmlTree.attributes.toXML()}?>`;
  }
}

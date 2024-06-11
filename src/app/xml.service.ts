import { Injectable } from '@angular/core';

import { XmlReaderService } from './xml-reader.service';
import { XmlWriterService } from './xml-writer.service';

export interface ParsedXMLTree {
  attributes: XMLAttribute[];
  root: ParsedXMLNode | undefined;
}

export interface ParsedXMLNode {
  tagName: string;
  attributes: XMLAttribute[];
  children: Array<ParsedXMLNode | string>;
  selfClosing: boolean;
}

export interface XMLAttribute {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class XmlService {
  constructor(
    private xmlReader: XmlReaderService,
    private xmlWriter: XmlWriterService
  ) {}

  read(xmlString: string): ParsedXMLTree {
    return this.xmlReader.readXML(xmlString);
  }

  write(xmlTree: ParsedXMLTree): string {
    return this.xmlWriter.writeXML(xmlTree);
  }
}

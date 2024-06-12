import { Injectable } from '@angular/core';

import { XmlReaderService } from './xml-reader.service';
import { XmlWriterService } from './xml-writer.service';
import { XMLTag } from '../classes/xml/xml-tag';
import { XMLAttribute } from '../classes/xml/xml-attribute';

export interface ParsedXMLTree {
  attributes: XMLAttribute[];
  root: XMLTag | undefined;
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

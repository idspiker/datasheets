import { Injectable } from '@angular/core';

import { unzipRaw } from 'unzipit';
import { Worksheet } from '../classes/xlsx/worksheet';

import { XmlService } from './xml.service';

import { ParsedXMLTree } from './xml.service';

export interface XMLFileData {
  fileName: string;
  dataTree: ParsedXMLTree;
}

interface RawXMLFileData {
  fileName: string;
  rawData: string;
}

@Injectable({
  providedIn: 'root',
})
export class XlsxReaderService {
  constructor(private xml: XmlService) {}

  async read(xlsxFile: File) {
    const rawWorkbook = await this.getXMLData(xlsxFile);

    console.log(rawWorkbook);

    const testWorksheet = new Worksheet('Sheet1', rawWorkbook[2].dataTree);

    console.log(testWorksheet);
    console.log(testWorksheet.get('A1'));
    console.log(this.xml.write(rawWorkbook[2].dataTree));
  }

  async unzip(xlsxFile: File): Promise<RawXMLFileData[]> {
    const unzipped = await unzipRaw(xlsxFile);

    const entries: RawXMLFileData[] = [];

    for (const entry of unzipped.entries) {
      entries.push({
        fileName: entry.name,
        rawData: await entry.text(),
      });
    }

    return entries;
  }

  async getXMLData(xlsxFile: File): Promise<XMLFileData[]> {
    const rawXMLFiles = await this.unzip(xlsxFile);

    const xmlFiles: XMLFileData[] = [];
    for (const rawFile of rawXMLFiles) {
      const xmlFileData = {
        fileName: rawFile.fileName,
        dataTree: this.xml.read(rawFile.rawData),
      };

      xmlFiles.push(xmlFileData);
    }

    return xmlFiles;
  }
}

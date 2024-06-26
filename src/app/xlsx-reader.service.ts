import { Injectable } from '@angular/core';

import { unzipRaw } from 'unzipit';
import { Workbook } from '../classes/xlsx/workbook';

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

    const workbook = new Workbook(rawWorkbook);

    console.log(workbook);
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

  async getXMLData(xlsxFile: File): Promise<Map<string, XMLFileData>> {
    const rawXMLFiles = await this.unzip(xlsxFile);

    const xmlFiles: Map<string, XMLFileData> = new Map();
    for (const rawFile of rawXMLFiles) {
      const xmlFileData = {
        fileName: rawFile.fileName,
        dataTree: this.xml.read(rawFile.rawData),
      };

      xmlFiles.set(rawFile.fileName, xmlFileData);
    }

    return xmlFiles;
  }
}

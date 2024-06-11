import { Injectable } from '@angular/core';
import { EventType } from '@angular/router';

import { unzipRaw, ZipEntry } from 'unzipit';

import { XmlService } from './xml.service';

import { ParsedXMLTree } from './xml.service';

interface XMLFileData {
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

    // unzipped.entries.forEach((e: ZipEntry) =>
    //   entries.push({ fileName: '', rawData: e.text() })
    // );

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

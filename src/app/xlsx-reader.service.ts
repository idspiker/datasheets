import { Injectable } from '@angular/core';

import { unzipRaw, ZipEntry } from 'unzipit';

import { XmlReaderService } from './xml-reader.service';

@Injectable({
  providedIn: 'root',
})
export class XlsxReaderService {
  constructor(private xmlReader: XmlReaderService) {}

  async read(xlsxFile: File) {
    const xmlFiles = await this.unzip(xlsxFile);

    console.log(this.xmlReader.readXML(xmlFiles[1]));
  }

  async unzip(xlsxFile: File): Promise<string[]> {
    const unzipped = await unzipRaw(xlsxFile);

    const entries: Promise<string>[] = [];

    unzipped.entries.forEach((e: ZipEntry) => entries.push(e.text()));

    return Promise.all(entries);
  }
}

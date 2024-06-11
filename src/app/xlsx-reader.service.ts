import { Injectable } from '@angular/core';

import { unzipRaw, ZipEntry } from 'unzipit';

import { XmlService } from './xml.service';

@Injectable({
  providedIn: 'root',
})
export class XlsxReaderService {
  constructor(private xml: XmlService) {}

  async read(xlsxFile: File) {
    const xmlFiles = await this.unzip(xlsxFile);

    const xmlTree = this.xml.read(xmlFiles[1]);
    console.log(xmlTree);

    console.log(this.xml.write(xmlTree));
  }

  async unzip(xlsxFile: File): Promise<string[]> {
    const unzipped = await unzipRaw(xlsxFile);

    const entries: Promise<string>[] = [];

    unzipped.entries.forEach((e: ZipEntry) => entries.push(e.text()));

    return Promise.all(entries);
  }
}

import { XMLFileData } from '../../app/xlsx-reader.service';
import { SharedStringsCatalog } from './shared-strings-catalog';
import { Worksheet } from './worksheet';

export class Workbook {
  name: string;
  worksheets: Map<string, Worksheet>;
  sharedStringsCatalog: SharedStringsCatalog;

  constructor(xmlFiles: XMLFileData[]) {
    // TODO actually parse sheets meta data
    this.name = 'test';

    let sharedStrings = undefined;
    for (const file of xmlFiles) {
      if (file.fileName === 'xl/sharedStrings.xml') {
        sharedStrings = new SharedStringsCatalog(file.dataTree);
      }
    }

    if (!sharedStrings) throw new Error('sharedStrings.xml not present');

    this.sharedStringsCatalog = sharedStrings;

    this.worksheets = new Map();
    for (const file of xmlFiles) {
      if (
        file.fileName.startsWith('xl/worksheets/') &&
        !file.fileName.startsWith('xl/worksheets/_rels/')
      ) {
        const worksheet = new Worksheet(
          file.fileName,
          file.dataTree,
          this.sharedStringsCatalog
        );

        this.worksheets.set(file.fileName, worksheet);
      }
    }
  }
}

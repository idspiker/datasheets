import { XMLFileData } from '../../app/xlsx-reader.service';
import { XMLTag } from '../xml/xml-tag';
import { XMLText } from '../xml/xml-text';
import { SharedStringsCatalog } from './shared-strings-catalog';
import { Worksheet } from './worksheet';

interface RelationshipData {
  id: string;
  type: string;
  fileName: string;
}

export class Workbook {
  worksheets: Map<string, Worksheet>;
  private sharedStringsCatalog: SharedStringsCatalog;

  constructor(xmlFiles: Map<string, XMLFileData>) {
    const workbookFile = xmlFiles.get('xl/workbook.xml');
    const workbookRelationshipsFile = xmlFiles.get(
      'xl/_rels/workbook.xml.rels'
    );

    if (!workbookFile || !workbookRelationshipsFile)
      throw new Error('xlsx file not valid');

    const relationshipData = this.getWorkbookRelationShipData(
      workbookRelationshipsFile
    );

    console.log(relationshipData);

    const sharedStrings = this.getSharedStrings(xmlFiles, relationshipData);

    if (!sharedStrings) throw new Error('xlsx not valid: no shared strings');

    this.sharedStringsCatalog = sharedStrings;

    this.worksheets = this.getSheets(workbookFile, relationshipData, xmlFiles);
  }

  private getWorkbookRelationShipData(
    relationshipsFile: XMLFileData
  ): RelationshipData[] {
    if (relationshipsFile.dataTree.root === undefined) {
      throw new Error('xlsx file not valid');
    }

    if (!relationshipsFile.dataTree.root.hasNameOf('Relationships')) {
      throw new Error('xlsx file not valid');
    }

    const rawRelationships = relationshipsFile.dataTree.root.children;

    const relationships: RelationshipData[] = [];
    for (const rawRelationship of rawRelationships) {
      if (!(rawRelationship instanceof XMLTag)) continue;

      const fileName = rawRelationship.attributes.get('Target');
      const id = rawRelationship.attributes.get('Id');
      const type = rawRelationship.attributes.get('Type');

      if (!fileName || !id || !type) throw new Error('Invalid relationship');

      relationships.push({ fileName: 'xl/' + fileName, id, type });
    }

    return relationships;
  }

  private getSharedStrings(
    xmlFiles: Map<string, XMLFileData>,
    rels: RelationshipData[]
  ): SharedStringsCatalog | undefined {
    let sharedStringsFileName = undefined;
    for (const relData of rels) {
      if (relData.type.endsWith('/sharedStrings')) {
        sharedStringsFileName = relData.fileName;
      }
    }

    if (!sharedStringsFileName) return undefined;

    const sharedStringsFile = xmlFiles.get(sharedStringsFileName);

    if (!sharedStringsFile) return undefined;

    return new SharedStringsCatalog(sharedStringsFile.dataTree);
  }

  private getSheets(
    workbookFile: XMLFileData,
    rels: RelationshipData[],
    xmlFiles: Map<string, XMLFileData>
  ): Map<string, Worksheet> {
    const worksheetsData: Map<string, RelationshipData> = new Map();
    for (const relData of rels) {
      if (relData.type.endsWith('/worksheet')) {
        worksheetsData.set(relData.id, relData);
      }
    }

    const workbookData = workbookFile.dataTree.root;

    if (!workbookData) throw new Error('xlsx is not valid');

    let sheetsData = undefined;

    for (const child of workbookData.children) {
      if (child instanceof XMLText) continue;

      if (child.hasNameOf('sheets')) {
        sheetsData = child;
      }
    }

    if (!sheetsData) throw new Error('xlsx is not valid');

    const worksheets: Map<string, Worksheet> = new Map();

    for (const sheet of sheetsData.children) {
      if (sheet instanceof XMLText) continue;

      const rId = sheet.attributes.get('r:id');
      const sheetId = sheet.attributes.get('sheetId');
      const name = sheet.attributes.get('name');
      const sheetState = sheet.attributes.get('state');

      if (!rId || !sheetId || !name || !sheetState) continue;

      const sheetRelData = worksheetsData.get(rId);

      if (!sheetRelData) continue;

      const sheetFile = xmlFiles.get(sheetRelData.fileName);

      if (!sheetFile) continue;

      const worksheet = new Worksheet(
        name,
        rId,
        sheetId,
        sheetFile.dataTree,
        this.sharedStringsCatalog,
        sheetState
      );

      worksheets.set(rId, worksheet);
    }

    return worksheets;
  }
}

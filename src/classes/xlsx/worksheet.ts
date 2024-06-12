import { ParsedXMLTree } from '../../app/xml.service';
import { XMLTag } from '../xml/xml-tag';
import { XMLText } from '../xml/xml-text';
import { Cell } from './cell';

interface RowData {
  rowNumber: number;
  cols: Map<string, Cell>;
}

interface CellData {
  column: string;
  cell: Cell;
}

export class Worksheet {
  // TODO fix string reading by parsing shared strings first, then adding shared strongs lookup on designated nodes (t="s")
  name: string;
  rows: Map<string, Cell>[];

  constructor(name: string, xmlWorksheet: ParsedXMLTree) {
    this.name = name;
    this.rows = this.parseWorksheetCells(xmlWorksheet);
  }

  get(key: string): string | undefined {
    const row = this.getRowFromKey(key);
    const col = this.getColFromKey(key);

    if (row === undefined || col === undefined) return undefined;

    const cellRow = this.rows[row];

    if (!cellRow) return undefined;

    const cell = cellRow.get(col);

    return cell ? cell.value : undefined;
  }

  private parseWorksheetCells(
    xmlWorksheet: ParsedXMLTree
  ): Map<string, Cell>[] {
    const data = this.getWorksheetData(xmlWorksheet);

    if (!data) return [];

    const rows: Map<string, Cell>[] = [];

    for (const row of data.children) {
      if (row instanceof XMLText) continue;

      const rowData = this.getRowData(row);

      if (!rowData) continue;

      rows[rowData.rowNumber] = rowData.cols;
    }

    return rows;
  }

  private getWorksheetData(xmlWorksheet: ParsedXMLTree): XMLTag | undefined {
    if (!xmlWorksheet.root) return undefined;

    let sheetData = undefined;
    for (const child of xmlWorksheet.root.children) {
      if (child instanceof XMLText) continue;

      if (child.tagName === 'sheetData') {
        sheetData = child;
        break;
      }
    }

    return sheetData;
  }

  private getRowData(rowNode: XMLTag): RowData | undefined {
    const cells: Map<string, Cell> = new Map();

    let rowNumber = rowNode.getAttributeValue('r');

    if (rowNumber === undefined) return undefined;

    for (const child of rowNode.children) {
      if (child instanceof XMLText) continue;

      if (child.tagName === 'c') {
        const cellData = this.processCell(child);

        if (!cellData) continue;

        cells.set(cellData.column, cellData.cell);
      }
    }

    return {
      rowNumber: Number(rowNumber),
      cols: cells,
    };
  }

  private processCell(cellNode: XMLTag): CellData | undefined {
    let key = cellNode.getAttributeValue('r');

    if (key === undefined) return undefined;

    const column = this.getColFromKey(key);

    if (!column) return undefined;

    let value = '';
    for (const child of cellNode.children) {
      if (child instanceof XMLText) continue;

      if (child.tagName === 'v' && child.children[0] instanceof XMLText) {
        value = child.children[0].value;
      }
    }

    return {
      column,
      cell: new Cell(value),
    };
  }

  private getColFromKey(key: string): string | undefined {
    const columnMatch = key.match(/^([a-zA-Z]+)[1-9]+/);
    if (!columnMatch) return undefined;

    return columnMatch[1];
  }

  private getRowFromKey(key: string): number | undefined {
    const rowMatch = key.match(/^[a-zA-Z]+([1-9]+)/);
    if (!rowMatch) return undefined;

    return Number(rowMatch[1]);
  }
}

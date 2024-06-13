import { SharedStringsCatalog } from './shared-strings-catalog';

export enum CellType {
  BOOLEAN,
  DATE,
  ERROR,
  INLINE_STRING,
  NUMBER,
  SHARED_STRING,
  FORMULA,
}

export class Cell {
  private value: string;
  style: string;
  type: CellType;
  private sharedStringsCatalog: SharedStringsCatalog;
  private formulaString: string;

  constructor(
    value: string,
    style: string = '1',
    type: CellType = CellType.NUMBER,
    sharedStringsCatalog: SharedStringsCatalog,
    formulaString: string = ''
  ) {
    this.value = value;
    this.style = style;
    this.type = type;
    this.sharedStringsCatalog = sharedStringsCatalog;
    this.formulaString = formulaString;
  }

  getValue(): string {
    switch (this.type) {
      case CellType.SHARED_STRING:
        const stringVal = this.sharedStringsCatalog.get(this.value);
        return stringVal ? stringVal : this.value;
      default:
        return this.value;
    }
  }

  static getType(cellTypeString: string): CellType {
    switch (cellTypeString) {
      case 'b':
        return CellType.BOOLEAN;
      case 'd':
        return CellType.DATE;
      case 'e':
        return CellType.ERROR;
      case 'inlineStr':
        return CellType.INLINE_STRING;
      case 's':
        return CellType.SHARED_STRING;
      case 'str':
        return CellType.FORMULA;
      default:
        return CellType.NUMBER;
    }
  }
}

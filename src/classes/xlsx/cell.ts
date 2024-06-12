import { SharedStringsCatalog } from './shared-strings-catalog';

export class Cell {
  private value: string;
  style: string;
  isSharedString: boolean;
  private sharedStringsCatalog: SharedStringsCatalog;

  constructor(
    value: string,
    style: string = '1',
    isSharedString: boolean = false,
    sharedStringsCatalog: SharedStringsCatalog
  ) {
    this.value = value;
    this.style = style;
    this.isSharedString = isSharedString;
    this.sharedStringsCatalog = sharedStringsCatalog;
  }

  getValue(): string | undefined {
    return this.isSharedString
      ? this.sharedStringsCatalog.get(this.value)
      : this.value;
  }
}

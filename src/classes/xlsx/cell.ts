export class Cell {
  value: string;
  style: string;
  isSharedString: boolean;

  constructor(
    value: string,
    style: string = '1',
    isSharedString: boolean = false
  ) {
    this.value = value;
    this.style = style;
    this.isSharedString = isSharedString;
  }
}

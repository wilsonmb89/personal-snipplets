export class DataMovementsFiduciary {
  constructor(date: string, type: string, value: string) {
      this.date = date;
      this.type = type;
      this.value = value;
  }
  date: string;
  type: string;
  value: string;
}

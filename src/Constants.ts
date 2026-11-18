export class Constants {
  static readonly MINUTEN_PRO_STUNDE = 60;
  static readonly EINHEIT_STUNDEN = "Std.";
  static readonly EINHEIT_MINUTEN = "Min.";

  static formatiereDauer(dauerMinuten: number): string {
    const stunden = Math.floor(dauerMinuten / Constants.MINUTEN_PRO_STUNDE);
    const minuten = dauerMinuten % Constants.MINUTEN_PRO_STUNDE;

    if (stunden === 0) {
      return `${minuten} ${Constants.EINHEIT_MINUTEN}`;
    }
    if (minuten === 0) {
      return `${stunden} ${Constants.EINHEIT_STUNDEN}`;
    }
    return `${stunden} ${Constants.EINHEIT_STUNDEN} ${minuten} ${Constants.EINHEIT_MINUTEN}`;
  }
}

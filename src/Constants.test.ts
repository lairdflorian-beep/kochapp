import { describe, test, expect } from "vitest";
import { Constants } from "./Constants";

describe("formatiereDauer", () => {
  test("zeigt 75 Minuten als Stunden und Minuten", () => {
    // Arrange
    const dauerMinuten = 75;
    // Act
    const ergebnis = Constants.formatiereDauer(dauerMinuten);
    // Assert
    expect(ergebnis).toBe("1 Std. 15 Min.");
  });
});

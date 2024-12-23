import { Currency } from "./currency.js";

export class Money {
    public constructor(
        public readonly currency: Currency,
        public readonly amountInMinorUnits: bigint,
    ) {}

    public static fromString(currency: Currency, amount: string): Money {
        let [wholePart, fractionPart] = amount.replaceAll("_", "").split(".");
        wholePart = wholePart ?? "";
        fractionPart = fractionPart ?? "";

        if (/[^0-9]/.test(wholePart) || /[^0-9]/.test(fractionPart)) {
            throw new Error(`Invalid amount: ${currency.code} ${amount}`);
        }

        let adjustment = currency.numDecimalPlaces - fractionPart.length;
        if (adjustment < 0) {
            throw new Error(`Invalid amount: ${currency.code} ${amount}`);
        } else if (adjustment > 0) {
            fractionPart = fractionPart + "0".repeat(adjustment);
        }

        let amountInMinorUnits = BigInt(wholePart) * currency.minorUnitRatio + BigInt(fractionPart);

        return new Money(currency, amountInMinorUnits);
    }

    public toString() {
        if (this.currency.minorUnitRatio == 1n) {
            return `${this.currency.code} ${this.amountInMinorUnits}`;
        }

        let wholePart = this.amountInMinorUnits / this.currency.minorUnitRatio;
        let fractionPart = this.amountInMinorUnits % this.currency.minorUnitRatio;
        let paddedFractionPart = fractionPart.toString().padStart(this.currency.numDecimalPlaces, "0");

        return `${this.currency.code} ${wholePart}.${paddedFractionPart}`;
    }
}

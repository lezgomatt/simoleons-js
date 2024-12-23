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

    public toString(): string {
        if (this.currency.minorUnitRatio == 1n) {
            return `${this.currency.code} ${this.amountInMinorUnits}`;
        }

        let wholePart = this.amountInMinorUnits / this.currency.minorUnitRatio;
        let fractionPart = this.amountInMinorUnits % this.currency.minorUnitRatio;
        let paddedFractionPart = fractionPart.toString().padStart(this.currency.numDecimalPlaces, "0");

        return `${this.currency.code} ${wholePart}.${paddedFractionPart}`;
    }

    public static sign(m: Money): -1 | 0 | 1 {
        if (m.amountInMinorUnits > 0n) {
            return 1;
        } else if (m.amountInMinorUnits === 0n) {
            return 0;
        } else {
            return -1;
        }
    }

    public static neg(m: Money): Money {
        return new Money(m.currency, -m.amountInMinorUnits);
    }

    public static abs(m: Money): Money {
        return m.amountInMinorUnits >= 0 ? m : Money.neg(m);
    }

    public static checkCompatibility(left: Money, right: Money): void {
        if (left.currency !== right.currency) {
            throw new Error(`Currency mismatch: ${left.currency.code} != ${right.currency.code}`);
        }
    }

    public static eq(left: Money, right: Money): boolean {
        Money.checkCompatibility(left, right);

        return left.amountInMinorUnits === right.amountInMinorUnits;
    }

    public static ntEq(left: Money, right: Money): boolean {
        Money.checkCompatibility(left, right);

        return left.amountInMinorUnits !== right.amountInMinorUnits;
    }

    public static lt(left: Money, right: Money): boolean {
        Money.checkCompatibility(left, right);

        return left.amountInMinorUnits < right.amountInMinorUnits;
    }

    public static ltEq(left: Money, right: Money): boolean {
        Money.checkCompatibility(left, right);

        return left.amountInMinorUnits <= right.amountInMinorUnits;
    }

    public static gt(left: Money, right: Money): boolean {
        Money.checkCompatibility(left, right);

        return left.amountInMinorUnits > right.amountInMinorUnits;
    }

    public static gtEq(left: Money, right: Money): boolean {
        Money.checkCompatibility(left, right);

        return left.amountInMinorUnits >= right.amountInMinorUnits;
    }

    public static add(left: Money, right: Money): Money {
        Money.checkCompatibility(left, right);

        return new Money(left.currency, left.amountInMinorUnits + right.amountInMinorUnits);
    }

    public static sub(left: Money, right: Money): Money {
        Money.checkCompatibility(left, right);

        return new Money(left.currency, left.amountInMinorUnits - right.amountInMinorUnits);
    }

    public static mul(m: Money, scalar: bigint): Money {
        return new Money(m.currency, m.amountInMinorUnits * scalar);
    }

    // TODO: sum
    // TODO: allocate

    public sign(): -1 | 0 | 1 { return Money.sign(this); }
    public neg(): Money { return Money.neg(this); }
    public abs(): Money { return Money.abs(this); }

    public eq(that: Money): boolean { return Money.eq(this, that); }
    public ntEq(that: Money): boolean { return Money.ntEq(this, that); }
    public lt(that: Money): boolean { return Money.lt(this, that); }
    public ltEq(that: Money): boolean { return Money.ltEq(this, that); }
    public gt(that: Money): boolean { return Money.gt(this, that); }
    public gtEq(that: Money): boolean { return Money.gtEq(this, that); }

    public add(that: Money): Money { return Money.add(this, that); }
    public sub(that: Money): Money { return Money.sub(this, that); }
    public mul(scalar: bigint): Money { return Money.mul(this, scalar); }
}

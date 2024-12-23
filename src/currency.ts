export class Currency {
    public readonly minorUnitRatio: bigint;

    public constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly numDecimalPlaces: number,
    ) {
        this.minorUnitRatio = 10n ** BigInt(numDecimalPlaces);
    }

    public static readonly Unknown = new Currency("NUL", "Unknown currency", 0);
}

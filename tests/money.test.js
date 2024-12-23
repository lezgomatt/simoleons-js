import test from "ava";

import { Currency, Money } from "../dist/index.js";

const JPY = new Currency("JPY", "Japanese Yen", 0);
const USD = new Currency("USD", "US Dollar", 2);
const BHD = new Currency("BHD", "Bahraini Dinar", 3);

test("constructor", t => {
    let m1 = new Money(JPY, 12345n);
    t.is(m1.currency, JPY);
    t.is(m1.amountInMinorUnits, 12345n);

    let m2 = new Money(USD, 9876n);
    t.is(m2.currency, USD);
    t.is(m2.amountInMinorUnits, 9876n);

    let m3 = new Money(BHD, 20241223n);
    t.is(m3.currency, BHD);
    t.is(m3.amountInMinorUnits, 20241223n);
});

test("fromString - basic", t => {
    let m1 = Money.fromString(JPY, "12345");
    t.is(m1.currency, JPY);
    t.is(m1.amountInMinorUnits, 12345n);

    let m2 = Money.fromString(USD, "98.76");
    t.is(m2.currency, USD);
    t.is(m2.amountInMinorUnits, 9876n);

    let m3 = Money.fromString(BHD, "20241.223");
    t.is(m3.currency, BHD);
    t.is(m3.amountInMinorUnits, 20241223n);
});

test("fromString - less decimal places", t => {
    let m1 = Money.fromString(USD, "9876");
    t.is(m1.amountInMinorUnits, 987600n);
    let m2 = Money.fromString(USD, "987.6");
    t.is(m2.amountInMinorUnits, 98760n);
    let m3 = Money.fromString(BHD, "20241223");
    t.is(m3.amountInMinorUnits, 20241223000n);
    let m4 = Money.fromString(BHD, "2024122.3");
    t.is(m4.amountInMinorUnits, 2024122300n);
    let m5 = Money.fromString(BHD, "202412.23");
    t.is(m5.amountInMinorUnits, 202412230n);
});

test("fromString - too many decimal places - zeros", t => {
    let m1 = Money.fromString(JPY, "12345.0");
    t.is(m1.amountInMinorUnits, 12345n);
    let m2 = Money.fromString(JPY, "12345.00");
    t.is(m2.amountInMinorUnits, 12345n);

    let m3 = Money.fromString(USD, "9876.500");
    t.is(m3.amountInMinorUnits, 987650n);
    let m4 = Money.fromString(USD, "9876.540");
    t.is(m4.amountInMinorUnits, 987654n);
    let m5 = Money.fromString(USD, "9876.0000");
    t.is(m5.amountInMinorUnits, 987600n);
});

test("fromString - too many decimal places - non-zero", t => {
    t.throws(() => Money.fromString(JPY, "12345.1"));
    t.throws(() => Money.fromString(JPY, "12345.01"));
    t.throws(() => Money.fromString(JPY, "12345.100"));

    t.throws(() => Money.fromString(USD, "98.765"));
    t.throws(() => Money.fromString(USD, "98.7650"));
});

test("fromString - non-digit", t => {
    t.throws(() => Money.fromString(JPY, "12E45"));
    t.throws(() => Money.fromString(JPY, "12e45"));
    t.throws(() => Money.fromString(JPY, "12,345"));
    t.throws(() => Money.fromString(USD, "$500"));
});

test("fromString - underscores", t => {
    let m1 = Money.fromString(JPY, "12_345");
    t.is(m1.amountInMinorUnits, 12345n);
    let m2 = Money.fromString(JPY, "1_2345");
    t.is(m2.amountInMinorUnits, 12345n);
    let m3 = Money.fromString(JPY, "123_45");
    t.is(m3.amountInMinorUnits, 12345n);
    let m4 = Money.fromString(JPY, "1234_5");
    t.is(m4.amountInMinorUnits, 12345n);

    let m5 = Money.fromString(USD, "9_876.50");
    t.is(m5.amountInMinorUnits, 987650n);
    let m6 = Money.fromString(USD, "9_8_7_6.5_0");
    t.is(m6.amountInMinorUnits, 987650n);
    let m7 = Money.fromString(USD, "9_876.5000_00");
    t.is(m7.amountInMinorUnits, 987650n);
});

test("toString", t => {
    let m1 = new Money(JPY, 12345n);
    t.is(m1.toString(), "JPY 12345");

    let m2 = new Money(USD, 9876n);
    t.is(m2.toString(), "USD 98.76");
    let m3 = new Money(USD, 987650n);
    t.is(m3.toString(), "USD 9876.50");
    let m4 = new Money(USD, 987600n);
    t.is(m4.toString(), "USD 9876.00");

    let m5 = new Money(BHD, 20241223n);
    t.is(m5.toString(), "BHD 20241.223");
});

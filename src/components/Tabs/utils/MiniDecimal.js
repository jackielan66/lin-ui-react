import {
    getNumberPrecision, isE, num2str, trimNumber, validateNumber,
} from './numberUtil';
import { supportBigInt } from './supportUtil';

export class BigIntDecimal {
    // origin
    // negative
    // integer
    // decimal
    // /** BigInt will convert `0009` to `9`. We need record the len of decimal */
    // decimalLen
    // empty
    // nan

    constructor(value) {
        if ((!value && value !== 0) || !String(value).trim()) {
            this.empty = true;
            return;
        }

        this.origin = String(value);

        // Act like Number convert
        if (value === '-') {
            this.nan = true;
            return;
        }

        let mergedValue = value;

        // We need convert back to Number since it require `toFixed` to handle this
        if (isE(mergedValue)) {
            mergedValue = Number(mergedValue);
        }

        mergedValue = typeof mergedValue === 'string' ? mergedValue : num2str(mergedValue);

        if (validateNumber(mergedValue)) {
            const trimRet = trimNumber(mergedValue);
            this.negative = trimRet.negative;
            const numbers = trimRet.trimStr.split('.');
            this.integer = BigInt(numbers[0]);
            const decimalStr = numbers[1] || '0';
            this.decimal = BigInt(decimalStr);
            this.decimalLen = decimalStr.length;
        } else {
            this.nan = true;
        }
    }

    getMark() {
        return this.negative ? '-' : '';
    }

    getIntegerStr() {
        return this.integer.toString();
    }

    getDecimalStr() {
        return this.decimal.toString().padStart(this.decimalLen, '0');
    }

    /**
     * Align BigIntDecimal with same decimal length. e.g. 12.3 + 5 = 1230000
     * This is used for add function only.
     */
    alignDecimal(decimalLength) {
        const str = `${this.getMark()}${this.getIntegerStr()}${this.getDecimalStr().padEnd(
            decimalLength,
            '0',
        )}`;
        return BigInt(str);
    }

    negate() {
        const clone = new BigIntDecimal(this.toString());
        clone.negative = !clone.negative;
        return clone;
    }

    add(value) {
        if (this.isInvalidate()) {
            return new BigIntDecimal(value);
        }

        const offset = new BigIntDecimal(value);
        if (offset.isInvalidate()) {
            return this;
        }

        const maxDecimalLength = Math.max(this.getDecimalStr().length, offset.getDecimalStr().length);
        const myAlignedDecimal = this.alignDecimal(maxDecimalLength);
        const offsetAlignedDecimal = offset.alignDecimal(maxDecimalLength);

        const valueStr = (myAlignedDecimal + offsetAlignedDecimal).toString();

        // We need fill string length back to `maxDecimalLength` to avoid parser failed
        const { negativeStr, trimStr } = trimNumber(valueStr);
        const hydrateValueStr = `${negativeStr}${trimStr.padStart(maxDecimalLength + 1, '0')}`;

        return new BigIntDecimal(
            `${hydrateValueStr.slice(0, -maxDecimalLength)}.${hydrateValueStr.slice(-maxDecimalLength)}`,
        );
    }

    isEmpty() {
        return this.empty;
    }

    isNaN() {
        return this.nan;
    }

    isInvalidate() {
        return this.isEmpty() || this.isNaN();
    }

    equals(target) {
        return this.toString() === target?.toString();
    }

    lessEquals(target) {
        return this.add(target.negate().toString()).toNumber() <= 0;
    }

    toNumber() {
        if (this.isNaN()) {
            return NaN;
        }
        return Number(this.toString());
    }

    toString(safe = true) {
        if (!safe) {
            return this.origin;
        }

        if (this.isInvalidate()) {
            return '';
        }

        return trimNumber(`${this.getMark()}${this.getIntegerStr()}.${this.getDecimalStr()}`).fullStr;
    }
}
export default function getMiniDecimal(value) {
    // We use BigInt here.
    // Will fallback to Number if not support.
    if (supportBigInt()) {
        return new BigIntDecimal(value);
    }
    return new NumberDecimal(value);
}

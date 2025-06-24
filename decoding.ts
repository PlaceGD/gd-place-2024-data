export const baseConvert = (
    digits: number[],
    fromBase: number,
    toBase: number
): number[] => {
    const BIG_FROM_BASE = BigInt(fromBase);
    const BIG_TO_BASE = BigInt(toBase);
    let bigSum = 0n;

    let zeroes = 0;
    for (const element of digits) {
        if (element == 0) {
            zeroes += 1;
        } else {
            break;
        }
    }

    for (let i = 0; i < digits.length; i++) {
        let p = digits.length - 1 - i;
        bigSum += BigInt(digits[i]) * BIG_FROM_BASE ** BigInt(p);
    }

    let ret: number[] = [];
    while (bigSum > 0n) {
        ret.push(Number(bigSum % BIG_TO_BASE));
        bigSum /= BIG_TO_BASE;
    }

    ret.push(...Array(zeroes).fill(0));
    ret.reverse();

    return ret;
};

const decode = (v: number[], base: number): Uint8Array =>
    new Uint8Array(baseConvert(v, base, 256));

export const decodeString = (s: string, base: number): Uint8Array => {
    const encoder = new TextEncoder();
    return decode([...encoder.encode(s)], base);
};

import { dialogBoxCreate } from "./DialogBox";
import { IMap } from "types";

/**
 * Adds a random offset to a number within a certain percentage
 * @example
 * // Returns between 95-105
 * addOffset(100, 5);
 * @example
 * // Returns between 63-77
 * addOffSet(70, 10);
 * @param midpoint The number to be the midpoint of the offset range
 * @param percentage The percentage (in a range of 0-100) to offset
 */
export function addOffset(midpoint: number, percentage: number) {
    const maxPercent: number = 100;
    if (percentage < 0 || percentage > maxPercent) {
        return midpoint;
    }

    const offset: number = midpoint * (percentage / maxPercent);

    // Double the range to account for both sides of the midpoint.
    // tslint:disable-next-line:no-magic-numbers
    return midpoint + ((Math.random() * (offset * 2)) - offset);
}

/**
 * Returns the input array as a comma separated string.
 *
 * Does several things that Array.toString() doesn't do
 *  - Adds brackets around the array
 *  - Adds quotation marks around strings
 */
export function arrayToString<T>(a: T[]) {
    const vals: any[] = [];
    for (let i = 0; i < a.length; ++i) {
        let elem: any = a[i];
        if (Array.isArray(elem)) {
            elem = arrayToString(elem);
        } else if (isString(elem)) {
            elem = `"${elem}"`;
        }
        vals.push(elem);
    }

    return `[${vals.join(", ")}]`;
}

/**
 * Clears defined properties from an object.
 * Does not delete up the prototype chain.
 * @deprecated Look into using `Map` or `Set` rather than manipulating properties on an Object.
 * @param obj the object to clear all properties
 */
export function clearObject(obj: any) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // tslint:disable-next-line:no-dynamic-delete
            delete obj[key];
        }
    }
}

/**
 * Does a shallow compare of two arrays to determine if they are equal.
 * @param a1 The first array
 * @param a2 The second array
 */
export function compareArrays<T>(a1: T[], a2: T[]) {
    if (a1.length !== a2.length) {
        return false;
    }

    for (let i = 0; i < a1.length; ++i) {
        if (Array.isArray(a1[i])) {
            // If the other element is not an array, then these cannot be equal
            if (!Array.isArray(a2[i])) {
                return false;
            }

            const elem1 = a1[i] as any as any[];
            const elem2 = a2[i] as any as any[];
            if (!compareArrays(elem1, elem2)) {
                return false;
            }
        } else if (a1[i] !== a2[i]) {
            return false;
        }
    }

    return true;
}

/**
 * Represents the possible configuration values that can be provided when creating the progress bar text.
 */
interface IProgressBarConfiguration {
    /**
     * Current progress, taken as a decimal (i.e. '0.6' to represent '60%')
     */
    progress?: number;

    /**
     * Total number of ticks in progress bar. Preferably a factor of 100.
     */
    totalTicks?: number;
}

/**
 * Represents concrete configuration values when creating the progress bar text.
 */
interface IProgressBarConfigurationMaterialized extends IProgressBarConfiguration {
    progress: number;
    totalTicks: number;
}

/**
 * Creates a graphical "progress bar"
 * e.g.:  [||||---------------]
 * @param params The configuration parameters for the progress bar
 */
export function createProgressBarText(params: IProgressBarConfiguration) {
    // Default values
    const defaultParams: IProgressBarConfigurationMaterialized = {
        progress: 0,
        totalTicks: 20,
    };

    // tslint:disable-next-line:prefer-object-spread
    const derived: IProgressBarConfigurationMaterialized = Object.assign({}, defaultParams, params);
    // Ensure it is 0..1
    derived.progress = Math.max(Math.min(derived.progress, 1), 0);

    // This way there is always at least one bar filled in...
    const bars: number = Math.max(Math.floor(derived.progress / (1 / derived.totalTicks)), 1);
    const dashes: number = Math.max(derived.totalTicks - bars, 0);

    // String.prototype.repeat isn't completley supported, but good enough for our purposes
    return `[${"|".repeat(bars)}${"-".repeat(dashes)}]`;
}

interface IError {
    fileName?: string;
    lineNumber?: number;
}

export function exceptionAlert(e: IError): void {
    console.error(e);
    dialogBoxCreate("Caught an exception: " + e + "<br><br>" +
                    "Filename: " + (e.fileName || "UNKNOWN FILE NAME") + "<br><br>" +
                    "Line Number: " + (e.lineNumber || "UNKNOWN LINE NUMBER") + "<br><br>" +
                    "This is a bug, please report to game developer with this " +
                    "message as well as details about how to reproduce the bug.<br><br>" +
                    "If you want to be safe, I suggest refreshing the game WITHOUT saving so that your " +
                    "safe doesn't get corrupted", false);
}

/**
 * Gets a random value in the range of a byte (0 - 255), or up to the maximum.
 * @param max The maximum value (up to 255).
 */
export function getRandomByte(max: number) {
    // Technically 2^8 is 256, but the values are 0-255, not 1-256.
    const byteMaximum: number = 255;
    const upper: number = Math.max(Math.min(max, byteMaximum), 0);

    return getRandomInt(0, upper);
}

/**
 * Gets a random integer bounded by the values passed in.
 * @param min The minimum value in the range.
 * @param max The maximum value in the range.
 */
export function getRandomInt(min: number, max: number) {
    const lower: number = Math.min(min, max);
    const upper: number = Math.max(min, max);

    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

/**
 * Returns a MM/DD HH:MM timestamp for the current time
 */
export function getTimestamp() {
        const d: Date = new Date();
        // A negative slice value takes from the end of the string rather than the beginning.
        const stringWidth: number = -2;
        const formattedHours: string = `0${d.getHours()}`.slice(stringWidth);
        const formattedMinutes: string = `0${d.getMinutes()}`.slice(stringWidth);

        return `${d.getMonth() + 1}/${d.getDate()} ${formattedHours}:${formattedMinutes}`;
}

/**
 * Determines if the number is a power of 2
 * @param n The number to check.
 */
export function isPowerOfTwo(n: number) {
    if (isNaN(n)) {
        return false;
    }

    if (n === 0) {
        return false;
    }

    // Disabiling the bitwise rule because it's honestly the most effecient way to check for this.
    // tslint:disable-next-line:no-bitwise
    return (n & (n - 1)) === 0;
}

/**
 * Checks whether the value passed in can be considered a string.
 * @param value The value to check if it is a string.
 */
export function isString(value: any): boolean {
    return (typeof value === "string" || value instanceof String);
}

/**
 * Checks whether a IP Address string is valid.
 * @param ipaddress A string representing a potential IP Address
 */
export function isValidIPAddress(ipaddress: string) {
    const byteRange: string = "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
    const regexStr: string = `^${byteRange}\.${byteRange}\.${byteRange}\.${byteRange}$`;
    const ipAddressRegex: RegExp = new RegExp(regexStr);

    return ipAddressRegex.test(ipaddress);
}

/**
 * Keyboard key codes
 */
export const KEY_CODES: IMap<number> = {
    A:              65,
    B:              66,
    C:              67,
    CTRL:           17,
    D:              68,
    DOWNARROW:      40,
    E:              69,
    ENTER:          13,
    ESC:            27,
    F:              70,
    H:              72,
    J:              74,
    K:              75,
    L:              76,
    M:              77,
    N:              78,
    O:              79,
    P:              80,
    R:              82,
    S:              83,
    TAB:            9,
    U:              85,
    UPARROW:        38,
    W:              87,
    1:            49,
    2:            50,
};

/**
 * Rounds a number to two decimal places.
 * @param decimal A decimal value to trim to two places.
 */
export function roundToTwo(decimal: number) {
    const leftShift: number = Math.round(parseFloat(`${decimal}e+2`));

    return +(`${leftShift}e-2`);
}
// Function that generates a random gibberish string of length n
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function createRandomString(n: number): string {
    let str: string = "";

    for (let i = 0; i < n; ++i) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

// Checks whether an array is a 2D array.
// For this, a 2D array is an array which contains only other arrays.
// If one element in the array is a number or string, it is NOT a 2D array
export function is2DArray(arr: any[]): boolean {
    if (arr.constructor !== Array) { return false; }

    return arr.every((e) => e.constructor === Array);
}

/**
 * Checks that a variable is a valid number. A valid number
 * must be a "number" type and cannot be NaN
 */
export function isValidNumber(n: number): boolean {
    return (typeof n === "number") && !isNaN(n);
}

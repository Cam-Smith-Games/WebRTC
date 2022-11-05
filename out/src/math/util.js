/** rounds number to nearest multiple of x
 * @example
 * round(12, 5) = 10
 * round(16, 7) = 14
*/
export function round(num, x) {
    return Math.floor(num / x) * x;
}
export function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
}
export function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}
/** returns true if absolute difference between two numbers lies within threshold (i.e. numbers are "close enough") */
export function near(n1, n2, thresh = 0.1) {
    return Math.abs(n1 - n2) <= thresh;
}
/**
* @param start numnber to start at
* @param end number to end at
* @param perc percentage (0-1) between start and end
*/
export function lerp(start, end, perc) {
    return (1 - perc) * start + (perc * end);
}
/** rounds x to nearest multiple of mult */
export function roundTo(x, mult) {
    // use case: negative vectors on grid should round down, while positive should round up
    return (x > 0) ? ceilTo(x, mult) : floorTo(x, mult);
}
export function ceilTo(x, mult) {
    return Math.ceil(x / mult) * mult;
}
export function floorTo(x, mult) {
    return Math.floor(x / mult) * mult;
}
//# sourceMappingURL=util.js.map
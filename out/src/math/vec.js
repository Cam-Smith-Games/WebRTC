import { ceilTo, floorTo, lerp, near, round, roundTo } from "./util.js";
/** namespace containing utility functions for dealing with IVectors that aren't an instance of the Vector class */
export const vec = {
    length: (v) => Math.sqrt(vec.lengthSquared(v)),
    lengthSquared: (v) => Math.pow(v.x, 2) + Math.pow(v.y, 2),
    mid: (v1, v2) => vec.scale(vec.add(v1, v2), 1 / 2),
    rotate: (v, radians, origin) => {
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        if (origin) {
            return {
                x: (cos * (v.x - origin.x)) + (sin * (v.y - origin.y)) + origin.x,
                y: (cos * (v.y - origin.y)) - (sin * (v.x - origin.x)) + origin.y
            };
        }
        return {
            x: (cos * v.x) - (sin * v.y),
            y: (sin * v.x) + (cos * v.y)
        };
    },
    rotate_old: (v, radians, pivot = null) => {
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let x, y;
        // not sure why rounding was necessary
        if (pivot) {
            x = Math.round((cos * (v.x - pivot.x)) -
                (sin * (v.y - pivot.y)) +
                pivot.x);
            y = Math.round((sin * (v.x - pivot.x)) +
                (cos * (v.y - pivot.y)) +
                pivot.y);
        }
        else {
            x = (cos * v.x) - (sin * v.y);
            y = (sin * v.x) + (cos * v.y);
        }
        return { x, y };
    },
    abs: (v) => ({ x: Math.abs(v.x), y: Math.abs(v.y) }),
    /**
     * @param start vector to start at
     * @param end vector to end at
     * @param t percentage (0-1) between start and end
     */
    lerp: (start, end, t) => ({
        x: lerp(start.x, end.x, t),
        y: lerp(start.y, end.y, t)
    }),
    equals: (v1, v2) => !(v1.x != v2.x || v1.y != v2.y),
    near: (v1, v2, thresh) => !(!near(v1.x, v2.x, thresh) || !near(v1.y, v2.y, thresh)),
    add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y }),
    subtract: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y }),
    dist: (v1, v2) => vec.length(vec.subtract(v1, v2)),
    //distSquared: (v1:IVector, v2:IVector) => vec3.lengthSquared(vec3.subtract(v1, v2)),
    scale: (v, x, y = x) => ({ x: v.x * x, y: v.y * y }),
    multiply: (v1, v2) => ({ x: v1.x * v2.x, y: v1.y * v2.y }),
    divide: (v1, v2) => ({ x: v1.x / v2.x, y: v1.y / v2.y }),
    sign: (v) => ({ x: Math.sign(v.x), y: Math.sign(v.y) }),
    dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y,
    cross: (v1, v2) => (v1.x * v2.y) - (v1.y * v2.x),
    unit: (v) => {
        let length = vec.length(v);
        // prevent division by zero
        return length ? vec.scale(v, 1 / length) : v;
    },
    normal: (v) => {
        return {
            x: -v.y,
            y: v.x
        };
    },
    /** projects point p onto vector v */
    project(point, line) {
        const denominator = vec.length(line);
        if (denominator == 0)
            return { x: 0, y: 0 };
        let dot = vec.dot(point, line);
        let dot2 = vec.dot(line, point);
        const scalar = dot / denominator;
        return vec.scale(line, scalar);
    },
    roundTo: (v, value) => ({ x: roundTo(v.x, value), y: roundTo(v.y, value) }),
    ceilTo: (v, value) => ({ x: ceilTo(v.x, value), y: ceilTo(v.y, value) }),
    floorTo: (v, value) => ({ x: floorTo(v.x, value), y: floorTo(v.y, value) }),
    roundToVec: (from, to) => ({ x: round(from.x, to.x), y: round(from.y, to.y) }),
    round: (v) => ({ x: Math.round(v.x), y: Math.round(v.y) }),
    ceil: (v) => ({ x: Math.ceil(v.x), y: Math.ceil(v.y) }),
    floor: (v) => ({ x: Math.floor(v.x), y: Math.floor(v.y) }),
    /** θ = acos [ (a · b) / (|a| |b|) ] */
    angleBetween: (v1, v2) => {
        return Math.acos(
        // doing a min here because it somehow became 1.00000002 one time which resulted in a NaN angle
        Math.min(1, vec.dot(v1, v2) / (vec.length(v1) * vec.length(v2))));
    },
    /** returns angle formed by 3 points (angle between the vectors formed by prev->center and center->next) */
    angle3: (prev, center, next) => {
        let seg1 = vec.subtract(prev, center);
        let seg2 = vec.subtract(next, center);
        return vec.angleBetween(seg1, seg2);
    },
    angle: (v) => {
        return Math.atan2(v.y, v.x);
    },
    angleTo: (v1, v2) => {
        let x_diff = v2.x - v1.x;
        let y_diff = v2.y - v1.y;
        return Math.atan2(y_diff, x_diff);
    },
    /** determines if point exists on line
     * @param l1 line start point
     * @param l2 line end point
     * @param p point to check
     * @param threshold threshold to account for rounding errors (higher # = less accurate)
     * @returns true if point p exists on line between l1 and l2 */
    contains(l1, l2, p, threshold = 0.001) {
        // distance from both endpoints to point
        let d = vec.dist(p, l1) + vec.dist(p, l2);
        // length of the line between l1 and l2
        let length = vec.dist(l1, l2);
        // if sum of two distances are equal to the line's length, the point is on the line
        return near(d, length, threshold);
    },
    overlap: (p1, p2, p3, p4) => {
        let slope1 = (vec.angle(vec.subtract(p2, p1))); // + Math.PI) % Math.PI;
        let slope2 = (vec.angle(vec.subtract(p4, p3))); // + Math.PI) % Math.PI;
        let diff = Math.abs(slope2 - slope1);
        if (near(diff, Math.PI, 0.01)) {
            // true if either line contains either of other lines endpoints
            return (vec.contains(p1, p2, p3) ||
                vec.contains(p1, p2, p4) ||
                vec.contains(p3, p4, p1) ||
                vec.contains(p3, p4, p2));
        }
        return false;
    },
    /** returns nearest point on infinite line */
    nearest_point: (line1, line2, pnt) => {
        var L2 = (((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)));
        if (L2 == 0)
            return null;
        var r = (((pnt.x - line1.x) * (line2.x - line1.x)) + ((pnt.y - line1.y) * (line2.y - line1.y))) / L2;
        return {
            x: line1.x + (r * (line2.x - line1.x)),
            y: line1.y + (r * (line2.y - line1.y))
        };
    },
    /** returns nearest point on finite line segment */
    nearest_between: (A, B, P) => {
        const v = vec.subtract(B, A);
        const u = vec.subtract(A, P);
        const vu = vec.dot(v, u);
        const t = -vu / vec.square_diag(v);
        if (t >= 0 && t <= 1)
            return vec.lerp(A, B, t);
        const g0 = vec.square_diag(vec.subtract(A, P));
        const g1 = vec.square_diag(vec.subtract(B, P));
        return g0 <= g1 ? A : B;
    },
    /** length of hypotenuse squared */
    square_diag: (v) => {
        return Math.pow(v.x, 2) + Math.pow(v.y, 2);
    },
    /** returns the shortest distance to the (infinite) line */
    shortest_dist: (line1, line2, pnt) => {
        var L2 = (((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)));
        if (L2 == 0)
            return Infinity;
        var s = (((line1.y - pnt.y) * (line2.x - line1.x)) - ((line1.x - pnt.x) * (line2.y - line1.y))) / L2;
        return Math.abs(s) * Math.sqrt(L2);
    },
    /** returns intersection point of 2 vectors, or null if they don't intersect */
    intersect(p1, p2, p3, p4) {
        let x1 = p1.x;
        let x2 = p2.x;
        let x3 = p3.x;
        let x4 = p4.x;
        let y1 = p1.y;
        let y2 = p2.y;
        let y3 = p3.y;
        let y4 = p4.y;
        // Check if none of the lines are of length 0
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4))
            return null;
        let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        // Lines are parallel
        if (denominator === 0)
            return null;
        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1)
            return null;
        return {
            x: x1 + ua * (x2 - x1),
            y: y1 + ua * (y2 - y1)
        };
    },
    /** converts a multi-dimensional array to list of IVectors
     * @example [[1,2]] -> [{x:1,y:2}] */
    fromArray: (array = []) => array.map(arr => ({ x: arr[0], y: arr[1] })),
    sum: (arr) => {
        let sum = { x: 0, y: 0 };
        for (let v of arr) {
            sum.x += v.x;
            sum.y += v.y;
        }
        return sum;
    },
    /** returns 0 if c is on the line, negative if point is to left of line, positive if point is to the right of line
     * @param a line point 1
     * @param b line point 2
     * @param c point to compare with line
     */
    line_point_dir: (a, b, c) => {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    },
    copy: (v) => ({ x: v.x, y: v.y }),
};
//# sourceMappingURL=vec.js.map
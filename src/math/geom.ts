
export interface IPoint { x:number; y:number;}
export interface IRect extends IPoint { w:number; h:number; }
export interface ICircle extends IPoint { radius:number; }



export const geom = {
    /** returns true if the specified axis-aligned bounding box contains the point. 
    * @note this doesn't take rotation into account, it requies rectangle and point being aligned on the same axis. If rotation is necessary, create an instance of RectangleShape, which handles rotation */
    AABBContainsPoint: (r:IRect, p:IPoint) =>  !(r.x > p.x || p.x > r.x + r.w || r.y > p.y  || p.y > r.y + r.h),
    AABBCollision: (r1:IRect, r2:IRect) => !(r2.x > (r1.x + r1.w) || (r2.x + r2.w) < r1.x || r2.y > (r1.y + r1.h) || (r2.y + r2.h) < r1.y),
}
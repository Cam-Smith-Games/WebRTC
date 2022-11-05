import { IPoint } from "../math/geom";


/** mouse utility functions for converting window to canvas coordinates etc */
export const Mouse = {

    getMouse(e:MouseEvent, canvas:HTMLCanvasElement):IPoint {
        // TODO: might need to account for canvas offset as well
        //       canvas is currently 100% width/height so not worrying about it
        let fit = this.getCanvasFit(canvas);
        return {
            x: (e.clientX - (canvas.clientWidth - fit.x) / 2) * canvas.width / fit.x,
            y: (e.clientY - (canvas.clientHeight - fit.y) / 2) * canvas.height / fit.y,
        }
    },

    // because canvas is using "object-fit:contain", need to account for black bars that are included in clientWidth/clientHeight
    getCanvasFit(canvas:HTMLCanvasElement):IPoint {

        const ratio = canvas.width / canvas.height;
        const scaled = canvas.clientWidth / canvas.clientHeight;

        if (ratio > scaled) {
            // window is too narow -> vertical offset (black bars)
            return {
                x: canvas.clientWidth,
                y: canvas.clientWidth / ratio
            }
        }
        else {
            // window is too short, -> horizontal offset (black bars)
            return {
                x: canvas.clientHeight * ratio,
                y: canvas.clientHeight 
            }      
        }
    }

}



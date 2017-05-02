namespace engine {

    export type MovieClipData = {

        _name: string,
        _frames: MovieClipFrameData[]
    }

    export type MovieClipFrameData = {
        "image": string
    }

    export interface Drawable {
        update();
    }

    export abstract class DisplayObject implements Drawable {
        type = "DisplayObject"
        x = 0;
        y = 0;
        scaleX = 1;
        scaleY = 1;
        rotation = 0;
        alpha = 1;
        globalAlpha = 1;
        isContainer = false;

        touchEnabled = false;

        parent: DisplayObjectContainer;

        relativeMatrix: Matrix;     //相对矩阵
        overallMatrix: Matrix;      //全局矩阵

        eventListenerList = [];

        constructor(type: string) {
            this.type = type;
            this.relativeMatrix = new Matrix();
            this.overallMatrix = new Matrix();
        }

        update() {
            //   this.relativeMatrix = new Matrix();
            this.relativeMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);

            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.alpha;
                this.overallMatrix = matrixAppendMatrix(this.relativeMatrix, this.parent.overallMatrix);
            } else {
                this.globalAlpha = this.alpha;
                this.overallMatrix = this.relativeMatrix;
            }

        }

        abstract hitTest(x, y);

        addEventListener(type: string, func: (e?: MouseEvent) => void, capture: boolean) {
            let listener = new engine.TouchEventListener(type, func, capture);
            this.eventListenerList.push(listener);
        };

        dispatchEvent(type: string, target: DisplayObject, currentTarget: DisplayObject) {
            for (var i = 0; i < this.eventListenerList.length; i++) {
                if (this.eventListenerList[i].type == type && this.touchEnabled == true) {
                    if (this.eventListenerList[i].capture == true) {
                        engine.TouchEventListenerManagement.list.unshift(this.eventListenerList[i]);
                    }
                    else if (this.eventListenerList[i].capture == false) {
                        engine.TouchEventListenerManagement.list.push(this.eventListenerList[i]);
                    }
                }
            }
        };
    }

    export class DisplayObjectContainer extends DisplayObject {
        isContainer = true;
        list: DisplayObject[] = [];

        // render(context: CanvasRenderingContext2D) {

        //     for (let displayObject of this.list) {
        //         displayObject.draw(context);
        //     }
        // }

        constructor() {
            super("DisplayObjectContainer");
        }

        update() {
            super.update();
            for (let drawable of this.list) {
                drawable.update();
            }
        }

        addChild(child: DisplayObject) {
            this.list.push(child);
            child.parent = this;
        }

        hitTest(x, y): DisplayObject {
            for (let i = this.list.length - 1; i >= 0; i--) {
                let child = this.list[i];
                let point = new Point(x, y);
                let invertChildRelativeMatrix = invertMatrix(this.relativeMatrix);
                let resultPoint = pointAppendMatrix(point, invertChildRelativeMatrix);
                let hitTestResult = child.hitTest(resultPoint.x, resultPoint.y);
                if (hitTestResult) {
                    return hitTestResult;
                }
            }
            return null;
        };

    }

    export class TextField extends DisplayObject {
        text = "";
        color = "";
        fontSize = 10;
        fontName = "";

        // render(context: CanvasRenderingContext2D) {
        //     context.fillStyle = this.color;
        //     context.font = this.fontSize.toString() + "px " + this.fontName.toString();
        //     // context.setTransform(this.overallMatrix.a, this.overallMatrix.b, this.overallMatrix.c, this.overallMatrix.d, this.overallMatrix.tx, this.overallMatrix.ty);
        //     context.fillText(this.text, 0, 0 + this.fontSize);

        // }
        constructor() {
            super("TextField");
        }

        hitTest(x, y) {
            let point = new Point(x, y);
            let invertChildRelativeMatrix = invertMatrix(this.relativeMatrix);
            let resultPoint = pointAppendMatrix(point, invertChildRelativeMatrix);
            let rectangle = new Rectangle(0, 0, this.text.length * 10, this.fontSize);
            if (rectangle.isPointInRectangle(resultPoint)) {
                //  console.log(this);
                return this;
            } else {
                return null;
            }

        };
    }

    export class Bitmap extends DisplayObject {
        // protected image: HTMLImageElement = null;
        image = new Image();
        public img: RES.ImageResource;
        isLoaded = false;
        constructor() {
            super("Bitmap");
            // this.image = document.createElement("img");
        }
        _src = "";
        setsrc(value: string) {
            this._src = value;
            this.isLoaded = false;
        }

        // render(context: CanvasRenderingContext2D) {
        //     this.image.src = this._src;
        //     if (this.isLoaded == true) {
        //         // context.setTransform(this.overallMatrix.a, this.overallMatrix.b, this.overallMatrix.c, this.overallMatrix.d, this.overallMatrix.tx, this.overallMatrix.ty);
        //         context.drawImage(this.image, 0, 0);

        //     } else {
        //         this.image.onload = () => {
        //             // context.drawImage(this.image, 0, 0);
        //             this.isLoaded = true;
        //         }
        //     }
        // }

        hitTest(x, y) {
            let point = new Point(x, y);
            let invertChildRelativeMatrix = invertMatrix(this.relativeMatrix);
            let resultPoint = pointAppendMatrix(point, invertChildRelativeMatrix);
            let rectangle = new Rectangle(0, 0, this.image.width, this.image.height);
            if (rectangle.isPointInRectangle(resultPoint)) {
                // console.log(this);
                return this;
            } else {
                return null;
            }
        };
    }

    export class MovieClip extends Bitmap {

        private advancedTime: number = 0;

        private static FRAME_TIME = 120;

        private TOTAL_FRAME = 2;

        private currentFrameIndex: number;

        private data: engine.MovieClipData;

        constructor(data: engine.MovieClipData) {
            super();
            this.setMovieClipData(data);
            this.TOTAL_FRAME = data._frames.length;
            //    this.play();
        }

        ticker = (deltaTime) => {
            // this.removeChild();
            this.advancedTime += deltaTime;
            if (this.advancedTime >= MovieClip.FRAME_TIME * this.TOTAL_FRAME) {
                this.advancedTime -= MovieClip.FRAME_TIME * this.TOTAL_FRAME;
            }
            this.currentFrameIndex = Math.floor(this.advancedTime / MovieClip.FRAME_TIME);

            if (this.currentFrameIndex <= this.TOTAL_FRAME) {
                let data = this.data;
                let frameData = data._frames[this.currentFrameIndex];
                let url = frameData.image;
                console.log(url);
                // this.setsrc(url);
                this._src = url;

            }
        }

        play() {
            Ticker.getInstance().register(this.ticker);
        }

        stop() {
            Ticker.getInstance().unregister(this.ticker)
        }

        setMovieClipData(data: MovieClipData) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 

        }
    }

}
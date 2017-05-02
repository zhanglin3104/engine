declare namespace engine {
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    function pointAppendMatrix(point: Point, m: Matrix): Point;
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x: number, y: number, width: number, height: number);
        isPointInRectangle(point: Point): boolean;
    }
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m: Matrix): Matrix;
    function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix;
    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        toString(): string;
        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
    }
}
declare namespace engine.RES {
    type imageConfig = {
        name: string;
        url: string;
        width: number;
        height: number;
    };
    class ImageResource {
        name: string;
        bitmapData: HTMLImageElement;
        url: string;
        width: number;
        height: number;
        isLoaded: boolean;
        constructor();
        load(): HTMLImageElement;
    }
    function loadRes(name: string): void;
    function getRes(name: string): ImageResource;
    function loadImageConfig(configList: imageConfig[]): void;
}
declare namespace engine {
    type Ticker_Listener_Type = (deltaTime: number) => void;
    class Ticker {
        private static instance;
        static getInstance(): Ticker;
        listeners: Ticker_Listener_Type[];
        register(listener: Ticker_Listener_Type): void;
        unregister(listener: Ticker_Listener_Type): void;
        notify(deltaTime: number): void;
    }
}
declare namespace engine {
    class TouchEventListener {
        type: string;
        func: (e?: MouseEvent) => void;
        capture: boolean;
        constructor(type: string, func: (e?: MouseEvent) => void, capture: boolean);
    }
    class TouchEventListenerManagement {
        static list: TouchEventListener[];
        static dispatch(e: MouseEvent): void;
    }
}
declare namespace engine {
    type MovieClipData = {
        _name: string;
        _frames: MovieClipFrameData[];
    };
    type MovieClipFrameData = {
        "image": string;
    };
    interface Drawable {
        update(): any;
    }
    abstract class DisplayObject implements Drawable {
        type: string;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        alpha: number;
        globalAlpha: number;
        isContainer: boolean;
        touchEnabled: boolean;
        parent: DisplayObjectContainer;
        relativeMatrix: Matrix;
        overallMatrix: Matrix;
        eventListenerList: any[];
        constructor(type: string);
        update(): void;
        abstract hitTest(x: any, y: any): any;
        addEventListener(type: string, func: (e?: MouseEvent) => void, capture: boolean): void;
        dispatchEvent(type: string, target: DisplayObject, currentTarget: DisplayObject): void;
    }
    class DisplayObjectContainer extends DisplayObject {
        isContainer: boolean;
        list: DisplayObject[];
        constructor();
        update(): void;
        addChild(child: DisplayObject): void;
        hitTest(x: any, y: any): DisplayObject;
    }
    class TextField extends DisplayObject {
        text: string;
        color: string;
        fontSize: number;
        fontName: string;
        constructor();
        hitTest(x: any, y: any): this;
    }
    class Bitmap extends DisplayObject {
        image: HTMLImageElement;
        img: RES.ImageResource;
        isLoaded: boolean;
        constructor();
        _src: string;
        setsrc(value: string): void;
        hitTest(x: any, y: any): this;
    }
    class MovieClip extends Bitmap {
        private advancedTime;
        private static FRAME_TIME;
        private TOTAL_FRAME;
        private currentFrameIndex;
        private data;
        constructor(data: engine.MovieClipData);
        ticker: (deltaTime: any) => void;
        play(): void;
        stop(): void;
        setMovieClipData(data: MovieClipData): void;
    }
}
declare namespace engine {
    let run: (canvas: HTMLCanvasElement) => DisplayObjectContainer;
}

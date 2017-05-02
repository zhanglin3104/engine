var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var engine;
(function (engine) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    engine.Point = Point;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    engine.pointAppendMatrix = pointAppendMatrix;
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            this.x = 0;
            this.y = 0;
            this.width = 1;
            this.height = 1;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Rectangle.prototype.isPointInRectangle = function (point) {
            if (point.x >= this.x &&
                point.x <= (this.x + this.width) &&
                point.y >= this.y &&
                point.y <= (this.y + this.height)) {
                return true;
            }
            else {
                return false;
            }
        };
        return Rectangle;
    }());
    engine.Rectangle = Rectangle;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    engine.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    engine.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        return Matrix;
    }());
    engine.Matrix = Matrix;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var RES;
    (function (RES) {
        var imageConfigList = [];
        var imageResourceList = [];
        var ImageResource = (function () {
            function ImageResource() {
                this.isLoaded = false;
            }
            ImageResource.prototype.load = function () {
                var _this = this;
                if (this.isLoaded == true) {
                    return this.bitmapData;
                }
                else {
                    var realImageResource = document.createElement("img");
                    realImageResource.src = this.url;
                    realImageResource.onload = function () {
                        _this.bitmapData = realImageResource;
                        _this.isLoaded = true;
                        //return this.bitmapData;
                    };
                }
            };
            return ImageResource;
        }());
        RES.ImageResource = ImageResource;
        function loadRes(name) {
            var imageResource = getRes(name);
            imageResource.load();
        }
        RES.loadRes = loadRes;
        function getRes(name) {
            for (var _i = 0, imageResourceList_1 = imageResourceList; _i < imageResourceList_1.length; _i++) {
                var _imageResource = imageResourceList_1[_i];
                if (_imageResource.name == name) {
                    return _imageResource;
                }
                else {
                    var tempImageResource = new ImageResource();
                    tempImageResource.name = name;
                    imageResourceList.push(tempImageResource);
                    console.log("没有找到相对应的图片，已生成一个");
                    return tempImageResource;
                }
            }
        }
        RES.getRes = getRes;
        function loadImageConfig(configList) {
            imageConfigList = configList;
            for (var _i = 0, imageConfigList_1 = imageConfigList; _i < imageConfigList_1.length; _i++) {
                var imageConfig = imageConfigList_1[_i];
                var imageResource = new ImageResource();
                imageResource.name = imageConfig.name;
                imageResource.url = imageConfig.url;
                imageResource.width = imageConfig.width;
                imageResource.height = imageConfig.height;
                imageResourceList.push(imageResource);
            }
        }
        RES.loadImageConfig = loadImageConfig;
    })(RES = engine.RES || (engine.RES = {}));
})(engine || (engine = {}));
var engine;
(function (engine) {
    var Ticker = (function () {
        function Ticker() {
            this.listeners = [];
        }
        Ticker.getInstance = function () {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        };
        Ticker.prototype.register = function (listener) {
            this.listeners.push(listener);
        };
        Ticker.prototype.unregister = function (listener) {
        };
        Ticker.prototype.notify = function (deltaTime) {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(deltaTime);
            }
        };
        return Ticker;
    }());
    engine.Ticker = Ticker;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var TouchEventListener = (function () {
        function TouchEventListener(type, func, capture) {
            this.capture = false;
            this.type = type;
            this.func = func;
            this.capture = capture;
        }
        return TouchEventListener;
    }());
    engine.TouchEventListener = TouchEventListener;
    var TouchEventListenerManagement = (function () {
        function TouchEventListenerManagement() {
        }
        TouchEventListenerManagement.dispatch = function (e) {
            for (var i = 0; i < TouchEventListenerManagement.list.length; i++) {
                TouchEventListenerManagement.list[i].func(e);
            }
            TouchEventListenerManagement.list = [];
        };
        TouchEventListenerManagement.list = [];
        return TouchEventListenerManagement;
    }());
    engine.TouchEventListenerManagement = TouchEventListenerManagement;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var DisplayObject = (function () {
        function DisplayObject(type) {
            this.type = "DisplayObject";
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.alpha = 1;
            this.globalAlpha = 1;
            this.isContainer = false;
            this.touchEnabled = false;
            this.eventListenerList = [];
            this.type = type;
            this.relativeMatrix = new engine.Matrix();
            this.overallMatrix = new engine.Matrix();
        }
        DisplayObject.prototype.update = function () {
            //   this.relativeMatrix = new Matrix();
            this.relativeMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.alpha;
                this.overallMatrix = engine.matrixAppendMatrix(this.relativeMatrix, this.parent.overallMatrix);
            }
            else {
                this.globalAlpha = this.alpha;
                this.overallMatrix = this.relativeMatrix;
            }
        };
        DisplayObject.prototype.addEventListener = function (type, func, capture) {
            var listener = new engine.TouchEventListener(type, func, capture);
            this.eventListenerList.push(listener);
        };
        ;
        DisplayObject.prototype.dispatchEvent = function (type, target, currentTarget) {
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
        ;
        return DisplayObject;
    }());
    engine.DisplayObject = DisplayObject;
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        // render(context: CanvasRenderingContext2D) {
        //     for (let displayObject of this.list) {
        //         displayObject.draw(context);
        //     }
        // }
        function DisplayObjectContainer() {
            _super.call(this, "DisplayObjectContainer");
            this.isContainer = true;
            this.list = [];
        }
        DisplayObjectContainer.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
                var drawable = _a[_i];
                drawable.update();
            }
        };
        DisplayObjectContainer.prototype.addChild = function (child) {
            this.list.push(child);
            child.parent = this;
        };
        DisplayObjectContainer.prototype.hitTest = function (x, y) {
            for (var i = this.list.length - 1; i >= 0; i--) {
                var child = this.list[i];
                var point = new engine.Point(x, y);
                var invertChildRelativeMatrix = engine.invertMatrix(this.relativeMatrix);
                var resultPoint = engine.pointAppendMatrix(point, invertChildRelativeMatrix);
                var hitTestResult = child.hitTest(resultPoint.x, resultPoint.y);
                if (hitTestResult) {
                    return hitTestResult;
                }
            }
            return null;
        };
        ;
        return DisplayObjectContainer;
    }(DisplayObject));
    engine.DisplayObjectContainer = DisplayObjectContainer;
    var TextField = (function (_super) {
        __extends(TextField, _super);
        // render(context: CanvasRenderingContext2D) {
        //     context.fillStyle = this.color;
        //     context.font = this.fontSize.toString() + "px " + this.fontName.toString();
        //     // context.setTransform(this.overallMatrix.a, this.overallMatrix.b, this.overallMatrix.c, this.overallMatrix.d, this.overallMatrix.tx, this.overallMatrix.ty);
        //     context.fillText(this.text, 0, 0 + this.fontSize);
        // }
        function TextField() {
            _super.call(this, "TextField");
            this.text = "";
            this.color = "";
            this.fontSize = 10;
            this.fontName = "";
        }
        TextField.prototype.hitTest = function (x, y) {
            var point = new engine.Point(x, y);
            var invertChildRelativeMatrix = engine.invertMatrix(this.relativeMatrix);
            var resultPoint = engine.pointAppendMatrix(point, invertChildRelativeMatrix);
            var rectangle = new engine.Rectangle(0, 0, this.text.length * 10, this.fontSize);
            if (rectangle.isPointInRectangle(resultPoint)) {
                //  console.log(this);
                return this;
            }
            else {
                return null;
            }
        };
        ;
        return TextField;
    }(DisplayObject));
    engine.TextField = TextField;
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap() {
            _super.call(this, "Bitmap");
            // protected image: HTMLImageElement = null;
            this.image = new Image();
            this.isLoaded = false;
            this._src = "";
            // this.image = document.createElement("img");
        }
        Bitmap.prototype.setsrc = function (value) {
            this._src = value;
            this.isLoaded = false;
        };
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
        Bitmap.prototype.hitTest = function (x, y) {
            var point = new engine.Point(x, y);
            var invertChildRelativeMatrix = engine.invertMatrix(this.relativeMatrix);
            var resultPoint = engine.pointAppendMatrix(point, invertChildRelativeMatrix);
            var rectangle = new engine.Rectangle(0, 0, this.image.width, this.image.height);
            if (rectangle.isPointInRectangle(resultPoint)) {
                // console.log(this);
                return this;
            }
            else {
                return null;
            }
        };
        ;
        return Bitmap;
    }(DisplayObject));
    engine.Bitmap = Bitmap;
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(data) {
            var _this = this;
            _super.call(this);
            this.advancedTime = 0;
            this.TOTAL_FRAME = 2;
            this.ticker = function (deltaTime) {
                // this.removeChild();
                _this.advancedTime += deltaTime;
                if (_this.advancedTime >= MovieClip.FRAME_TIME * _this.TOTAL_FRAME) {
                    _this.advancedTime -= MovieClip.FRAME_TIME * _this.TOTAL_FRAME;
                }
                _this.currentFrameIndex = Math.floor(_this.advancedTime / MovieClip.FRAME_TIME);
                if (_this.currentFrameIndex <= _this.TOTAL_FRAME) {
                    var data = _this.data;
                    var frameData = data._frames[_this.currentFrameIndex];
                    var url = frameData.image;
                    console.log(url);
                    // this.setsrc(url);
                    _this._src = url;
                }
            };
            this.setMovieClipData(data);
            this.TOTAL_FRAME = data._frames.length;
            //    this.play();
        }
        MovieClip.prototype.play = function () {
            engine.Ticker.getInstance().register(this.ticker);
        };
        MovieClip.prototype.stop = function () {
            engine.Ticker.getInstance().unregister(this.ticker);
        };
        MovieClip.prototype.setMovieClipData = function (data) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 
        };
        MovieClip.FRAME_TIME = 120;
        return MovieClip;
    }(Bitmap));
    engine.MovieClip = MovieClip;
})(engine || (engine = {}));
var engine;
(function (engine) {
    engine.run = function (canvas) {
        var stage = new engine.DisplayObjectContainer();
        var context = canvas.getContext("2d");
        var lastNow = Date.now();
        var renderer = new CanvasRenderer(stage, context);
        var frameHandler = function () {
            var now = Date.now();
            var deltaTime = now - lastNow;
            engine.Ticker.getInstance().notify(deltaTime);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            stage.update();
            renderer.render();
            context.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
        var doMouseEvent = function (e, type) {
            var x = e.offsetX;
            var y = e.offsetY;
            var target = stage.hitTest(x, y);
            var result = target;
            if (result) {
                result.dispatchEvent(type, target, target);
                while (result.parent) {
                    var currentTarget = result.parent;
                    //    let e = { type, target, currentTarget };
                    result.parent.dispatchEvent(type, target, currentTarget);
                    result = result.parent;
                }
                engine.TouchEventListenerManagement.dispatch(e);
            }
        };
        window.onmousedown = function (e) {
            doMouseEvent(e, "mousedown");
            window.onmousemove = function (e) {
                doMouseEvent(e, "mousemove");
            };
            window.onmouseup = function (e) {
                doMouseEvent(e, "mouseup");
                window.onmousemove = function () { };
                window.onmouseup = function () { };
            };
        };
        // setInterval(() => {
        //     context.setTransform(1, 0, 0, 1, 0, 0);
        //     context.clearRect(0, 0, canvas.width, canvas.height);
        //     stage.draw(context);
        // }, 30)
        return stage;
    };
    var CanvasRenderer = (function () {
        function CanvasRenderer(stage, context2D) {
            this.stage = stage;
            this.context2D = context2D;
        }
        CanvasRenderer.prototype.render = function () {
            var stage = this.stage;
            var context2D = this.context2D;
            this.renderContainer(stage);
        };
        CanvasRenderer.prototype.renderContainer = function (container) {
            for (var _i = 0, _a = container.list; _i < _a.length; _i++) {
                var child = _a[_i];
                var context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                var m = child.overallMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                if (child.type == "Bitmap") {
                    this.renderBitmap(child);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child);
                }
            }
        };
        CanvasRenderer.prototype.renderBitmap = function (bitmap) {
            // bitmap.image.src = bitmap._src;
            // if (bitmap.isLoaded == true) {
            //     // context.setTransform(this.overallMatrix.a, this.overallMatrix.b, this.overallMatrix.c, this.overallMatrix.d, this.overallMatrix.tx, this.overallMatrix.ty);
            //     this.context2D.drawImage(bitmap.image, 0, 0);
            // } else {
            //     bitmap.image.onload = () => {
            //         // context.drawImage(this.image, 0, 0);
            //      //   this.context2D.drawImage(bitmap.image, 0, 0);
            //         bitmap.isLoaded = true;
            //     }
            // }
            this.context2D.drawImage(bitmap.img.bitmapData, 0, 0);
        };
        CanvasRenderer.prototype.renderTextField = function (textField) {
            this.context2D.fillStyle = textField.color;
            this.context2D.font = textField.fontSize.toString() + "px " + textField.fontName.toString();
            this.context2D.fillText(textField.text, 0, 0 + textField.fontSize);
        };
        return CanvasRenderer;
    }());
})(engine || (engine = {}));

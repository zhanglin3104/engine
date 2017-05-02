namespace engine {
    export let run = (canvas: HTMLCanvasElement) => {

        var stage = new DisplayObjectContainer();
        let context = canvas.getContext("2d");
        let lastNow = Date.now();
        let renderer = new CanvasRenderer(stage, context);
        let frameHandler = () => {
            let now = Date.now();
            let deltaTime = now - lastNow;
            Ticker.getInstance().notify(deltaTime);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            stage.update();
            renderer.render();
            context.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }

        window.requestAnimationFrame(frameHandler);

        var doMouseEvent = (e: MouseEvent, type: string) => {
            let x = e.offsetX;
            let y = e.offsetY;
            let target = stage.hitTest(x, y);
            let result = target;
            if (result) {
                result.dispatchEvent(type, target, target);
                while (result.parent) {
                    let currentTarget = result.parent;
                    //    let e = { type, target, currentTarget };
                    result.parent.dispatchEvent(type, target, currentTarget);
                    result = result.parent;
                }
                engine.TouchEventListenerManagement.dispatch(e);
            }

        }

        window.onmousedown = (e) => {

            doMouseEvent(e, "mousedown");
            window.onmousemove = (e) => {
                doMouseEvent(e, "mousemove");
            }
            window.onmouseup = (e) => {
                doMouseEvent(e, "mouseup");
                window.onmousemove = () => { }
                window.onmouseup = () => { }
            }

        }

        // setInterval(() => {
        //     context.setTransform(1, 0, 0, 1, 0, 0);
        //     context.clearRect(0, 0, canvas.width, canvas.height);
        //     stage.draw(context);
        // }, 30)

        return stage;

    }

    class CanvasRenderer {

        constructor(private stage: DisplayObjectContainer, private context2D: CanvasRenderingContext2D) {

        }

        render() {
            let stage = this.stage;
            let context2D = this.context2D;
            this.renderContainer(stage);
        }

        renderContainer(container: DisplayObjectContainer) {
            for (let child of container.list) {
                let context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                let m = child.overallMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);

                if (child.type == "Bitmap") {
                    this.renderBitmap(child as Bitmap);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child as TextField);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child as DisplayObjectContainer);
                }
            }
        }

        renderBitmap(bitmap: Bitmap) {
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
        }

        renderTextField(textField: TextField) {
            this.context2D.fillStyle = textField.color;
            this.context2D.font = textField.fontSize.toString() + "px " + textField.fontName.toString();
            this.context2D.fillText(textField.text, 0, 0 + textField.fontSize);
        }

    }

}
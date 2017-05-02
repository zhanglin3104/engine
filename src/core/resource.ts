namespace engine.RES {

    var imageConfigList: imageConfig[] = [];

    var imageResourceList: ImageResource[] = [];

    export type imageConfig = {
        name: string,
        url: string,
        width: number,
        height: number;
    }

    export class ImageResource {

        public name: string;
        public bitmapData: HTMLImageElement;
        public url: string;
        public width: number;
        public height: number;
        public isLoaded: boolean;

        public constructor() {
            this.isLoaded = false;
        }

        public load() {
            if (this.isLoaded == true) {
                return this.bitmapData;
            } else {
                var realImageResource = document.createElement("img");
                realImageResource.src = this.url;
                realImageResource.onload = () => {
                    this.bitmapData = realImageResource;
                    this.isLoaded = true;
                    //return this.bitmapData;
                }
            }

        }
    }

    export function loadRes(name: string) {
        var imageResource = getRes(name);
        imageResource.load();
    }

    export function getRes(name: string) {
        for (let _imageResource of imageResourceList) {
            if (_imageResource.name == name) {
                return _imageResource;
            } else {
                var tempImageResource = new ImageResource()
                tempImageResource.name = name;
                imageResourceList.push(tempImageResource);
                console.log("没有找到相对应的图片，已生成一个")
                return tempImageResource;
            }
        }
    }

    export function loadImageConfig(configList: imageConfig[]) {
        imageConfigList = configList;
        for (let imageConfig of imageConfigList) {
            var imageResource = new ImageResource();
            imageResource.name = imageConfig.name;
            imageResource.url = imageConfig.url;
            imageResource.width = imageConfig.width;
            imageResource.height = imageConfig.height;
            imageResourceList.push(imageResource);
        }
    }

}
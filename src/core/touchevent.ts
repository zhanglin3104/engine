namespace engine {
    export class TouchEventListener {
        type: string;
        func: (e?: MouseEvent) => void;
        capture = false;

        constructor(type: string, func: (e?: MouseEvent) => void, capture: boolean) {
            this.type = type;
            this.func = func;
            this.capture = capture;

        }
    }

    export class TouchEventListenerManagement {

        static list: TouchEventListener[] = [];
        static dispatch(e: MouseEvent) {
            for (var i = 0; i < TouchEventListenerManagement.list.length; i++) {
                TouchEventListenerManagement.list[i].func(e);
            }
            TouchEventListenerManagement.list = [];
        }

    }
}
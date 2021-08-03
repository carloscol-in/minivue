class PewReactive {
    constructor(options) {
        this.origin = options.data();

        // destiny
        this.$data = new Proxy(this.origin, {
            get(target, name) {
                if ( name in target ) {
                    return target[name];
                }

                console.warn(`Property "${name}" does not exist on object.`);
                return "";
            },
        });
    }

    mount() {
        document.querySelectorAll("*[p-text]").forEach(el => {
            this.pText(el, this.$data, el.getAttribute("p-text"));
        });
    }

    pText(el, target, name) {
        el.innerText = target[name];
    }

    pModel() {}
}

var Pew = {
    createApp(options) {
        return new PewReactive(options);
    }
}
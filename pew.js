class PewReactive {
    constructor(options) {
        this.origin = options.data();

        // destiny
        this.$data = new Proxy(this.origin, {
            get(target, name) {
                if ( Reflect.has(target, name) ) {
                    return Reflect.get(target, name);
                }

                console.warn(`Property "${name}" does not exist on object.`);
                return "";
            },
            set(target, name, value) {
                Reflect.set(target, name, value);
            }
        });
    }

    mount() {
        document.querySelectorAll("*[p-text]").forEach(el => {
            this.pText(el, this.$data, el.getAttribute("p-text"));
        });

        document.querySelectorAll("*[p-model]").forEach(el => {
            const name = el.getAttribute("p-model");
            this.pModel(el, this.$data, name);

            el.addEventListener("input", () => {
                Reflect.set(this.$data, name, el.value)
            });
        })
    }

    pText(el, target, name) {
        el.innerText = Reflect.get(target, name);
    }

    pModel(el, target, name) {
        el.value = Reflect.get(target, name);
    }
}

var Pew = {
    createApp(options) {
        return new PewReactive(options);
    }
}
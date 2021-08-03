class PewReactive {
    // dependencies
    deps = new Map();

    constructor(options) {
        this.origin = options.data();

        const self = this;

        // destiny
        this.$data = new Proxy(this.origin, {
            get(target, name) {
                if ( Reflect.has(target, name) ) {
                    self.track(target, name);
                    return Reflect.get(target, name);
                }

                console.warn(`Property "${name}" does not exist on object.`);
                return "";
            },
            set(target, name, value) {
                Reflect.set(target, name, value);
                self.trigger(name);
            }
        });
    }

    track(target, name) {
        if (!this.deps.has(name)) {
            const effect = () => {
                document.querySelectorAll(`*[p-text=${name}]`).forEach(el => {
                    this.pText(el, target, name);
                });
            }
            this.deps.set(name, effect);
        }
    }

    trigger(name) {
        const effect = this.deps.get(name);
        effect();
    }

    mount() {
        // p-text
        document.querySelectorAll("*[p-text]").forEach(el => {
            this.pText(el, this.$data, el.getAttribute("p-text"));
        });

        // p-model
        document.querySelectorAll("*[p-model]").forEach(el => {
            const name = el.getAttribute("p-model");
            this.pModel(el, this.$data, name);

            el.addEventListener("input", () => {
                Reflect.set(this.$data, name, el.value)
            });
        });

        // p-bind
        document.querySelectorAll("*[p-bind]").forEach(el => {
            const [attr, name] = el.getAttribute("p-bind").split(":");
            this.pBind(el, this.$data, name, attr);
        });
    }

    pText(el, target, name) {
        el.innerText = Reflect.get(target, name);
    }

    pModel(el, target, name) {
        el.value = Reflect.get(target, name);
    }

    pBind(el, target, name, attr) {
        el.setAttribute( attr, Reflect.get(target, name) );
    }
}

var Pew = {
    createApp(options) {
        return new PewReactive(options);
    }
}
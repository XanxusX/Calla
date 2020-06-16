﻿import "./protos.js";
import { Input, Label } from "./htmltags.js";
import { htmlFor, type } from "./htmlattrs.js";
import { HtmlCustomTag } from "./htmlcustom.js";

export class LabeledInputTag extends HtmlCustomTag {
    constructor(id, inputType, labelText, ...rest) {
        super();

        this.label = Label(
            htmlFor(id),
            labelText);

        this.input = Input(
            type(inputType),
            ...rest);

        this.element.append(
            this.label,
            this.input);

        Object.seal(this);
    }

    addEventListener(name, callback) {
        this.input.addEventListener(name, callback);
    }

    removeEventListener(name, callback) {
        this.input.removeEventListener(name, callback);
    }

    async once(resolveEvt, rejectEvt, timeout) {
        return await this.input.once(resolveEvt, rejectEvt, timeout);
    }

    get value() {
        return this.input.value;
    }

    set value(v) {
        this.input.value = v;
    }

    get checked() {
        return this.input.checked;
    }

    set checked(v) {
        this.input.checked = v;
    }
}
import { isString } from "./helpers/isString";
/**
 * Appends the specified number of breaks (as children) to the specified element
 * @param el The element to add child break elements to.
 * @param n The number of breaks to add.
 */
export function appendLineBreaks(el: HTMLElement, n: number) {
    for (let i: number = 0; i < n; ++i) {
        el.appendChild(createElement("br"));
    }
}

/**
 * Given an element by its ID, removes all event listeners from that element by cloning and
 * replacing. Then returns the new cloned element.
 * @param elemId The HTML ID to retrieve the element by.
 */
export function clearEventListeners(elemId: string | HTMLElement): HTMLElement | null {
    try {
        let elem: HTMLElement;
        if (isString(elemId)) {
            elem = getElementById(elemId);
        } else {
            elem = elemId;
        }

        const newElem: HTMLElement = elem.cloneNode(true) as HTMLElement;
        if (elem.parentNode !== null) {
            elem.parentNode.replaceChild(newElem, elem);
        }

        return newElem;
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);

        return null;
    }
}

/**
 * Clears all <option> elements from a <select>.
 * @param selector The <select> element
 */
export function clearSelector(selector: HTMLSelectElement) {
    for (let i: number = selector.options.length - 1; i >= 0; i--) {
        selector.remove(i);
    }
}

/**
 * Possible configuration parameters when creating the accordion element.
 */
interface IAccordionConfigurationParameters {
    /**
     * The HTML to appear in the accordion header.
     */
    hdrText?: string;

    /**
     * A (hopefully) unique identifier for the accordion.
     */
    id?: string;

    /**
     * The HTML to appear in the expanded accordion.
     */
    panelText?: string;
}

/**
 * Creates both the header and panel element of an accordion and sets the click handler
 * @param params The creation parameters.
 */
export function createAccordionElement(params: IAccordionConfigurationParameters) {
    const liElem: HTMLLIElement = createElement("li") as HTMLLIElement;
    const header: HTMLButtonElement = createElement("button", {
        class: "accordion-header",
        clickListener() {
            this.classList.toggle("active");
            const pnl: CSSStyleDeclaration = (this.nextElementSibling as HTMLDivElement).style;
            pnl.display = pnl.display === "block" ? "none" : "block";
        },
        id: params.id !== undefined ? `${params.id}-hdr` : undefined,
        innerHTML: params.hdrText,
    }) as HTMLButtonElement;
    const panel: HTMLDivElement = createElement("div", {
        class: "accordion-panel",
        id: params.id !== undefined ? `${params.id}-panel` : undefined,
        innerHTML: params.panelText,
    }) as HTMLDivElement;

    liElem.appendChild(header);
    liElem.appendChild(panel);

    return [
        liElem,
        header,
        panel,
    ];
}

/**
 * Options specific to creating an anchor ("<a>") element.
 */
interface ICreateElementAnchorOptions {
    href?: string;
    target?: string;
    text?: string;
}

/**
 * Options specific to creating an input ("<input>") element.
 */
interface ICreateElementInputOptions {
    value?: string;
    checked?: boolean;
    max?: string;
    maxLength?: number;
    min?: string;
    name?: string;
    pattern?: string;
    placeholder?: string;
    step?: string;
    type?: string;
}

/**
 * Options specific to creating a label ("<label>") element.
 */
interface ICreateElementLabelOptions {
    for?: string;
}

/**
 * Options for setting up event listeners on the element.
 */
interface ICreateElementListenerOptions {
    changeListener?(this: HTMLElement, ev: Event): any;
    clickListener?(this: HTMLElement, ev: MouseEvent): any;
    inputListener?(this: HTMLElement, ev: Event): any;
    onfocus?(this: HTMLElement, ev: FocusEvent): any;
    onkeydown?(this: HTMLElement, ev: KeyboardEvent): any;
    onkeyup?(this: HTMLElement, ev: KeyboardEvent): any;
}

/**
 * Options for setting up the inline-styling of element.
 * NOTE: Relying on CSS styling should be preferred over forcing the higher specificity via inline styles.
 */
interface ICreateElementStyleOptions {
    backgroundColor?: string;
    border?: string;
    color?: string;
    display?: string;
    float?: string;
    fontSize?: string;
    margin?: string;
    marginLeft?: string;
    marginTop?: string;
    overflow?: string;
    padding?: string;
    position?: string;
    visibility?: string;
    whiteSpace?: string;
    width?: string;
}

/**
 * Options for adding an in-game tooltip to the element.
 */
interface ICreateElementTooltipOptions {
    tooltip?: string;
    tooltipleft?: string;
    tooltipsmall?: string;
    tooltiplow?: string;
}

/**
 * All possible configuration options when creating an element.
 */
interface ICreateElementOptions extends
    ICreateElementStyleOptions,
    ICreateElementListenerOptions,
    ICreateElementInputOptions,
    ICreateElementAnchorOptions,
    ICreateElementLabelOptions,
    ICreateElementTooltipOptions {
    /**
     * CSS Class(es) to initially set.
     */
    class?: string;

    /**
     * A (hopefully) unique identifier for the element.
     */
    id?: string;

    innerHTML?: string;
    innerText?: string;
    tabIndex?: number;
}

function setElementAnchor(el: HTMLAnchorElement, params: ICreateElementAnchorOptions) {
    if (params.text !== undefined) {
        el.text = params.text;
    }
    if (params.href !== undefined) {
        el.href = params.href;
    }
    if (params.target !== undefined) {
        el.target = params.target;
    }
}

function setElementInput(el: HTMLInputElement, params: ICreateElementInputOptions) {
    if (params.name !== undefined) {
        el.name = params.name;
    }
    if (params.value !== undefined) {
        el.value = params.value;
    }
    if (params.type !== undefined) {
        el.type = params.type;
    }
    if (params.checked !== undefined) {
        el.checked = params.checked;
    }
    if (params.pattern !== undefined) {
        el.pattern = params.pattern;
    }
    if (params.maxLength !== undefined) {
        el.maxLength = params.maxLength;
    }
    if (params.placeholder !== undefined) {
        el.placeholder = params.placeholder;
    }
    if (params.max !== undefined) {
        el.max = params.max;
    }
    if (params.min !== undefined) {
        el.min = params.min;
    }
    if (params.step !== undefined) {
        el.step = params.step;
    }
}

function setElementLabel(el: HTMLLabelElement, params: ICreateElementLabelOptions) {
    if (params.for !== undefined) {
        el.htmlFor = params.for;
    }
}

function setElementListeners(el: HTMLElement, params: ICreateElementListenerOptions) {
    // tslint:disable:no-unbound-method
    if (params.clickListener !== undefined) {
        el.addEventListener("click", params.clickListener);
    }
    if (params.inputListener !== undefined) {
        el.addEventListener("input", params.inputListener);
    }
    if (params.changeListener !== undefined) {
        el.addEventListener("change", params.changeListener);
    }
    if (params.onkeyup !== undefined) {
        el.addEventListener("keyup", params.onkeyup);
    }
    if (params.onkeydown !== undefined) {
        el.addEventListener("keydown", params.onkeydown);
    }
    if (params.onfocus !== undefined) {
        el.addEventListener("focus", params.onfocus);
    }
    // tslint:enable:no-unbound-method
}

function setElementStyle(el: HTMLElement, params: ICreateElementStyleOptions) {
    if (params.display !== undefined) {
        el.style.display = params.display;
    }
    if (params.visibility !== undefined) {
        el.style.visibility = params.visibility;
    }
    if (params.margin !== undefined) {
        el.style.margin = params.margin;
    }
    if (params.marginLeft !== undefined) {
        el.style.marginLeft = params.marginLeft;
    }
    if (params.marginTop !== undefined) {
        el.style.marginTop = params.marginTop;
    }
    if (params.padding !== undefined) {
        el.style.padding = params.padding;
    }
    if (params.color !== undefined) {
        el.style.color = params.color;
    }
    if (params.border !== undefined) {
        el.style.border = params.border;
    }
    if (params.float !== undefined) {
        el.style.cssFloat = params.float;
    }
    if (params.fontSize !== undefined) {
        el.style.fontSize = params.fontSize;
    }
    if (params.whiteSpace !== undefined) {
        el.style.whiteSpace = params.whiteSpace;
    }
    if (params.width !== undefined) {
        el.style.width = params.width;
    }
    if (params.backgroundColor !== undefined) {
        el.style.backgroundColor = params.backgroundColor;
    }
    if (params.position !== undefined) {
        el.style.position = params.position;
    }
    if (params.overflow !== undefined) {
        el.style.overflow = params.overflow;
    }
}

function setElementTooltip(el: HTMLElement, params: ICreateElementTooltipOptions) {
    if (params.tooltip !== undefined && params.tooltip !== "")     {
        el.className += " tooltip";
        el.appendChild(createElement("span", {
            class: "tooltiptext",
            innerHTML: params.tooltip,
        }));
    } else if (params.tooltipleft !== undefined) {
        el.className += " tooltip";
        el.appendChild(createElement("span", {
            class: "tooltiptextleft",
            innerHTML: params.tooltipleft,
        }));
    } else if (params.tooltipsmall !== undefined) {
        el.className += " tooltip";
        el.appendChild(createElement("span", {
            class: "tooltiptext smallfont",
            innerHTML: params.tooltipsmall,
        }));
    } else if (params.tooltiplow !== undefined) {
        el.className += "tooltip";
        el.appendChild(createElement("span", {
            class: "tooltiptextlow",
            innerHTML: params.tooltiplow,
        }));
    }
}

/**
 * An all-in-one-call way of creating an element to be added to the DOM at some point.
 * @param tagName The HTML tag/element name
 * @param params Additional parameters to set on the element
 */
export function createElement(tagName: string, params: ICreateElementOptions = {}) {
    const el: HTMLElement = document.createElement(tagName);

    if (params.id !== undefined) {
        el.id = params.id;
    }
    if (params.class !== undefined) {
        el.className = params.class;
    }
    if (params.innerHTML !== undefined) {
        el.innerHTML = params.innerHTML;
    }
    if (params.innerText !== undefined) {
        el.innerText = params.innerText;
    }
    if (params.tabIndex !== undefined) {
        el.tabIndex = params.tabIndex;
    }

    setElementAnchor(el as HTMLAnchorElement, params);
    setElementInput(el as HTMLInputElement, params);
    setElementLabel(el as HTMLLabelElement, params);
    setElementListeners(el, params);
    setElementStyle(el, params);
    setElementTooltip(el, params);

    return el;
}

export function createOptionElement(text: string, value: string= ""): HTMLOptionElement {
    let sanitizedValue: string = value;
    if (sanitizedValue === "") { sanitizedValue = text; }

    return createElement("option", {
        text,
        value: sanitizedValue,
    }) as HTMLOptionElement;
}

interface ICreatePopupOptions {
    backgroundColor?: string;
}

/**
 * Creates the necessary DOM elements to present an in-game popup to the player.
 * @param id The (hopefully) unique identifier for the popup container.
 * @param elems The collection of HTML Elements to show within the popup.
 */
export function createPopup(id: string, elems: HTMLElement[], options: ICreatePopupOptions= {}) {
    const container: HTMLDivElement = createElement("div", {
        class: "popup-box-container",
        display: "flex",
        id,
    }) as HTMLDivElement;
    const content: HTMLElement = createElement("div", {
        class: "popup-box-content",
        id: `${id}-content`,
    });

    for (const elem of elems) {
        content.appendChild(elem);
    }

    // Configurable Options
    if (options.backgroundColor) {
        content.style.backgroundColor = options.backgroundColor;
    }

    container.appendChild(content);
    getElementById("entire-game-container").appendChild(container);

    return container;
}

interface ICreatePopupCloseButtonOptions {
    class?: string;
    display?: string;
    innerText?: string;
    type?: string;
}

/**
 * Creates a Close/Cancel button that is used for removing popups
 */
export function createPopupCloseButton(popup: Element | string, options: ICreatePopupCloseButtonOptions) {
    let button: HTMLButtonElement;

    function closePopupWithEscFn(e: any): void {
        if (e.keyCode === 27) {
            button.click();
        }
    }

    button = createElement("button", {
        class: options.class ? options.class : "popup-box-button",
        display: options.display ? options.display : "inline-block",
        innerText: options.innerText == null ? "Cancel" : options.innerText,
        clickListener: () => {
            if (popup instanceof Element) {
                removeElement(popup);
            } else {
                try {
                    const popupEl = document.getElementById(popup);
                    if (popupEl instanceof Element) {
                        removeElement(popupEl);
                    }
                } catch (e) {
                    console.error(`createPopupCloseButton() threw: ${e}`);
                }
            }

            document.removeEventListener("keydown", closePopupWithEscFn);
            return false;
        },
    }) as HTMLButtonElement;

    document.addEventListener("keydown", closePopupWithEscFn);

    return button;
}

/**
 * Returns a reference to the first object with the specified value of the ID or NAME attribute,
 * throwing an error if it is unable to find it.
 * @param elementId The HTML ID to retrieve the element by.
 * @throws {Error} When the 'elementId' cannot be found.
 */
export function getElementById(elementId: string) {
    const el: HTMLElement | null = document.getElementById(elementId);
    if (el === null) {
        throw new Error(`Unable to find element with id '${elementId}'`);
    }

    return el;
}

export function getSelectValue(selector: HTMLSelectElement | null): string {
    if (selector == null) { return ""; }
    if (selector.options.length <= 0) { return ""; }
    if (selector.selectedIndex < 0) { return ""; }
    return selector.options[selector.selectedIndex].value;
}

export function getSelectText(selector: HTMLSelectElement | null): string {
    if (selector == null) { return ""; }
    if (selector.options.length <= 0) { return ""; }
    if (selector.selectedIndex < 0) { return ""; }
    return selector.options[selector.selectedIndex].text;
}
/**
 * Clears out all children from the provided element.
 * If a string is passed in, it will treat it as an ID and search for the element to delete all children from.
 * @param el The element or ID of an element to remove all children from.
 */
export function removeChildrenFromElement(el: string | null | Element) {
    if (el === null) {
        return;
    }

    try {
        const elem: HTMLElement | Element = (isString(el) ? getElementById(el as string) : el as Element);

        if (elem instanceof Element) {
            while (elem.firstChild !== null) {
                elem.removeChild(elem.firstChild);
            }
        }
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.debug(e);

        return;
    }
}

/**
 * For a given element, this function removes it AND its children
 * @param elem The element to remove.
 */
export function removeElement(elem: Element | null) {
    if (elem === null) {
        // tslint:disable-next-line:no-console
        console.debug("The element passed into 'removeElement' was null.");

        return;
    }
    if (!(elem instanceof Element)) {
        // tslint:disable-next-line:no-console
        console.debug("The element passed into 'removeElement' was not an instance of an Element.");

        return;
    }

    while (elem.firstChild !== null) {
        elem.removeChild(elem.firstChild);
    }

    if (elem.parentNode !== null) {
        elem.parentNode.removeChild(elem);
    }
}

/**
 * Given its id, this function removes an element AND its children
 * @param id The HTML identifier to search for and remove.
 */
export function removeElementById(id: string) {
    try {
        const elem: HTMLElement = getElementById(id);
        removeElement(elem);
    } catch (e) {
        // Probably should log this as we're trying to remove elements that don't exist.
    }
}

/**
 * Routes the player from the Loading screen to the main game content.
 */
export function removeLoadingScreen() {
    // TODO: Have this manipulate CSS classes instead of direct styles
    removeElementById("loader");
    getElementById("entire-game-container").style.visibility = "visible";
}

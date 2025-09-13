// Get an element
// @param id {string} - The id of the element
// @param props {string} - The style selector
// @param className {string} - The class of the element
// @returns {Element} - The element identified
export function getEl<T>({id, className, prop} : {id?: string, className?: string, prop?: string}) : T {
    let element;
    if (id){
       element = document.getElementById(id) as T;
    } else if (className) {
        element = document.getElementsByClassName(className)[0] as T;
    } else if (prop) {
        element = document.querySelector(prop) as T;
    } else{
        throw new Error("No element id or class");
    }
    return element;
}

// Get a list of elements
// @param className {string} - The class of the elements
// @param props {string} - The style selector
// @returns {Element[]} - The elements identified
export function getEls<T>({className, prop} : {className?: string, prop?: string}) : T[]{
    let element;
    if (className) {
        element = Array.from(document.getElementsByClassName(className)) as T[];
    } else if (prop) {
        element = Array.from(document.querySelectorAll(prop)) as T[];
    } else{
        throw new Error("No element identifiers");
    }
    return element;
}


// Get the style of an element
// @param element {HTMLElement} - The element to get the style of
// @returns {CSSStyleDeclaration} - The style of the element
export function getStyle(element : HTMLElement) {
    return getComputedStyle(element);
}


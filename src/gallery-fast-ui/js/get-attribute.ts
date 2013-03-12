function getAttribute(element, name) {
    if (!element.attributes) {
        return null;
    }

    for (var i = 0; i < element.attributes.length; i++) {
        if (element.attributes[i].name === name) {
            return element.attributes[i].value;
        }
    }

    return null;
}

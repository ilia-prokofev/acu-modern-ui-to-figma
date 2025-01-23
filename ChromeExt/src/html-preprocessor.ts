// Function to remove elements with `display: none` from a cloned document
function removeHiddenElementsFromClone(doc: HTMLElement) {
    const elements = doc.querySelectorAll('*');
    elements.forEach(element => {
        const style = (element as HTMLElement).getAttribute('data-display');
        if (style === 'none') {
            element.remove();
        }
    });
}

// Function to create a deep clone of the document and mark elements with `display: none`
function cloneDocumentWithDisplayMarking(doc: HTMLElement): HTMLElement {
    const clonedDoc = doc.cloneNode(true) as HTMLElement;
    const elements = doc.querySelectorAll<HTMLElement>('*');

    elements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.display === 'none') {
            const clonedElement = clonedDoc.querySelectorAll<HTMLElement>('*')[index];
            clonedElement.setAttribute('data-display', 'none');
        }
    });

    return clonedDoc;
}
``
function addValuesToUserInputs(iframeDoc: HTMLElement) {
    const inputs = iframeDoc.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'checkbox' || input.type === 'radio') {
            input.setAttribute('value', input.value);
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked
                    ? input.setAttribute('checked', 'checked')
                    : input.removeAttribute('checked');
            }
        }
    });

    const textAreas = iframeDoc.querySelectorAll('textarea');
    textAreas.forEach(textarea => {
        textarea.textContent = textarea.value;
    });

    const selects = iframeDoc.querySelectorAll('select');
    selects.forEach(select => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption) {
            select.setAttribute('value', selectedOption.value);
        }
    });
}

export function preprocessHtml(mainIFrame: Document) {
    const mainWs = mainIFrame.getElementById('mainWorkspace');
    if (!mainWs) {
        throw new Error('Element with id "mainWorkspace" not found. Make sure you are using Modern UI.');
    }

    const clonedDoc = cloneDocumentWithDisplayMarking(mainWs)
    removeHiddenElementsFromClone(clonedDoc);
    addValuesToUserInputs(clonedDoc); // Update inputs inside iframe
    return clonedDoc?.outerHTML || null;
}
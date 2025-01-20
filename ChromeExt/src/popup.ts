import {AcuPageParser} from './acu-page-parser';

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

function readRootHTML() {
    const iframe = document.getElementById('main') as HTMLIFrameElement;
    if (!iframe || !iframe.contentDocument) {
        throw new Error('Iframe with id "main" not found or not accessible.');
    }

    const iframeDoc = iframe.contentDocument;
    const mainWs = iframeDoc.getElementById('mainWorkspace');
    if (!mainWs) {
        throw new Error('Element with id "mainWorkspace" not found. Make sure you are using Modern UI.');
    }

    const clonedDoc = cloneDocumentWithDisplayMarking(mainWs)
    removeHiddenElementsFromClone(clonedDoc);
    addValuesToUserInputs(clonedDoc); // Update inputs inside iframe
    return clonedDoc?.outerHTML || null;
}

document.getElementById('exportBtn')?.addEventListener('click', () => {
    const button = document.getElementById('exportBtn') as HTMLButtonElement;

    // Reset button state
    button.style.backgroundColor = '#2a7de1';
    button.innerText = 'Export for Figma';
    button.disabled = true;

    chrome.tabs.query({active: true, currentWindow: true}, (tabs: chrome.tabs.Tab[]) => {
        if (tabs[0].id) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: readRootHTML
            }, (results) => {
                button.disabled = false;

                if (results && results[0] && results[0].result) {
                    const htmlContent = results[0].result;
                    console.log(htmlContent);
                    // Create instance of AcuPageParser and parse HTML content
                    const parser = new AcuPageParser();
                    const parsedStructure = parser.parse(htmlContent);
                    // Process parsed data if needed, for example, copying JSON to clipboard
                    const parsedDataJSON = JSON.stringify(parsedStructure, null, 2);
                    // Copy to clipboard
                    navigator.clipboard.writeText(parsedDataJSON).then(() => {
                        button.style.backgroundColor = '#28a745';
                        button.innerText = 'Success!';
                    }).catch(err => {
                        button.style.backgroundColor = '#dc3545';
                        button.innerText = 'Error';
                    });
                } else {
                    button.style.backgroundColor = '#dc3545';
                    button.innerText = 'Error';
                }
            });
        }
    });
});

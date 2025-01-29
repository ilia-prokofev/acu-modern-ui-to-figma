import { AcuPageParser } from './acu-page-parser';

// --- Helper Functions ---

// Sets the button to "error" state and updates the tooltip text
function setErrorState(
    button: HTMLButtonElement,
    tooltipEl: HTMLSpanElement | null,
    errorMessage: string
) {
    button.classList.remove('success');
    button.classList.add('error');
    button.innerText = 'Error';
    button.parentElement?.classList.add('error');
    if (tooltipEl) {
        tooltipEl.textContent = errorMessage;
    }
}

// Sets the button to "success" state (clears any tooltip text)
function setSuccessState(
    button: HTMLButtonElement,
    tooltipEl: HTMLSpanElement | null
) {
    button.classList.remove('error');
    button.parentElement?.classList.remove('error')
    button.classList.add('success');
    button.innerText = 'Success!';
    if (tooltipEl) {
        tooltipEl.textContent = '';
    }
}

// removes elements with `data-display="none"`
function removeHiddenElementsFromClone(doc: HTMLElement) {
    const elements = doc.querySelectorAll('*');
    elements.forEach(element => {
        const style = (element as HTMLElement).getAttribute('data-display');
        if (style === 'none') {
            element.remove();
        }
    });
}

// creates a deep clone and marks elements with `data-display="none"` if computed style is "display: none"
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

// assigns user-entered values to inputs, textareas, and selects
function addValuesToUserInputs(iframeDoc: HTMLElement) {
    const inputs = iframeDoc.querySelectorAll('input');
    inputs.forEach(input => {
        if (
            input.type === 'text' ||
            input.type === 'checkbox' ||
            input.type === 'radio'
        ) {
            input.setAttribute('value', input.value);
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked) {
                    input.setAttribute('checked', 'checked');
                } else {
                    input.removeAttribute('checked');
                }
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
    const clonedDoc = cloneDocumentWithDisplayMarking(mainWs);
    removeHiddenElementsFromClone(clonedDoc);
    addValuesToUserInputs(clonedDoc);

    return clonedDoc?.outerHTML || null;
}

function readRootHTMLWrapper() {
    try {
        const data = readRootHTML();
        console.warn(data);
        return { data };
    } catch (error: any) {
        console.warn(error);
        return { error: error.message };
    }
}

document.getElementById('exportBtn')?.addEventListener('click', () => {
    const button = document.getElementById('exportBtn') as HTMLButtonElement;
    const tooltipEl = button.parentElement?.querySelector('.tooltip') as HTMLDivElement | null;

    // Reset button state
    button.classList.remove('success', 'error');
    button.innerText = 'Export JSON';
    if (tooltipEl) {
        tooltipEl.textContent = '';
    }
    button.disabled = true;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    func: readRootHTMLWrapper,
                },
                (results) => {
                    button.disabled = false;

                    // Check Chrome runtime errors
                    if (chrome.runtime.lastError) {
                        setErrorState(button, tooltipEl, <string>chrome.runtime.lastError.message);
                        return;
                    }

                    const res = results?.[0]?.result;

                    // If our wrapper returned an error
                    if (res?.error) {
                        setErrorState(button, tooltipEl, res.error);
                        return;
                    }

                    // If we got valid data
                    if (res?.data) {
                        try {
                            const htmlContent = res.data;
                            console.log(htmlContent);
                            const parser = new AcuPageParser();
                            const parsedStructure = parser.parse(htmlContent);
                            const parsedDataJSON = JSON.stringify(parsedStructure, null, 2);

                            navigator.clipboard
                                .writeText(parsedDataJSON)
                                .then(() => {
                                    setSuccessState(button, tooltipEl);
                                })
                                .catch((err) => {
                                    setErrorState(button, tooltipEl, err.message || 'Failed to copy data');
                                });
                        } catch (parseError: any) {
                            setErrorState(button, tooltipEl, 'Failed to parse HTML: ' + parseError.message);
                        }
                    } else {
                        setErrorState(button, tooltipEl, 'No valid HTML returned');
                    }
                }
            );
        }
    });
});
import { AcuPageParser } from './acu-page-parser';

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
                func: function () {
                    // Add value attributes to inputs, textareas, and selects inside the iframe
                    function addValuesToUserInputs(iframeDoc: Document) {
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

                        const textareas = iframeDoc.querySelectorAll('textarea');
                        textareas.forEach(textarea => {
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

                    // Get the iframe and its document
                    const iframe = document.getElementById('main') as HTMLIFrameElement;
                    if (iframe && iframe.contentDocument) {
                        const iframeDoc = iframe.contentDocument;
                        addValuesToUserInputs(iframeDoc); // Update inputs inside iframe

                        const mainWs = iframeDoc.getElementById('mainWorkspace');
                        const outerHtml = mainWs?.outerHTML;

                        if (outerHtml) {
                            return outerHtml;
                        } else {
                            console.error('Element with id "mainWorkspace" not found.');
                        }
                    } else {
                        console.error('Iframe with id "main" not found or not accessible.');
                    }
                    return null;
                }
            }, (results) => {
                button.disabled = false;

                if (results && results[0] && results[0].result) {
                    const htmlContent = results[0].result;
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

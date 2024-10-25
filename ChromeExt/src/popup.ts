document.getElementById(' Btn')?.addEventListener('click', () => {
    const button = document.getElementById(' Btn') as HTMLButtonElement;

    // Reset button state
    button.style.backgroundColor = '#2a7de1';
    button.innerText = '  for Figma';
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

                    // Copy to clipboard
                    navigator.clipboard.writeText(htmlContent).then(() => {
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

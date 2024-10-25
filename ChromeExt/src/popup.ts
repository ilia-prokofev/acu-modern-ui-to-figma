document.getElementById(' Btn')?.addEventListener('click', () => {
    const button = document.getElementById(' Btn') as HTMLButtonElement;

    // Reset button state
    button.style.backgroundColor = '#2a7de1';
    button.innerText = '  for Figma';
    button.disabled = true;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        if (tabs[0].id) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: function() {
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

                          enum AcuElementType {
                            QPField = 'QPField',
                            QPFieldSet = 'QPFieldSet',
                            Root = 'Root',
                        }

                          interface AcuElement {
                            Type: AcuElementType;
                        }

                          interface AcuContainer extends AcuElement {
                            Children: AcuElement[];
                        }

                          enum QPFieldElementType {
                            TextEditor = 'TextEditor',
                            Currency = 'Currency'
                        }

                          interface QPField extends AcuElement {
                            Type: AcuElementType.QPField;
                            Label: string | null;
                            ElementType: QPFieldElementType | null;
                            Value: string | null;
                        }

                          interface QPFieldset extends AcuContainer {
                            Type: AcuElementType.QPFieldSet;
                        }

                        interface ElementVisitor {
                            visit(htmlElement: ChildNode, parent: AcuElement): boolean;
                        }

                        class LabelVisitor implements ElementVisitor {
                            visit(htmlElement: ChildNode, parent: AcuElement): boolean {
                                if (parent.Type !== AcuElementType.QPField) {
                                    return false;
                                }

                                if (htmlElement.nodeName.toLowerCase() !== "label") {
                                    return false;
                                }

                                (parent as QPField).Label = htmlElement.textContent;

                                VisitChildren(htmlElement, parent);

                                return true;
                            }
                        }

                        class QPFieldVisitor implements ElementVisitor {
                            visit(htmlElement: ChildNode, parent: AcuElement): boolean {
                                if (!(parent as AcuContainer)) {
                                    return false;
                                }

                                if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
                                    return false;
                                }

                                const child: QPField = {
                                    Type: AcuElementType.QPField,
                                    ElementType: null,
                                    Value: null,
                                    Label: null,
                                };
                                (parent as AcuContainer).Children.push(child);

                                VisitChildren(htmlElement, child);

                                return true;
                            }
                        }

                        class QPFieldsetVisitor implements ElementVisitor {
                            visit(htmlElement: ChildNode, parent: AcuElement): boolean {
                                if (!(parent as AcuContainer).Children) {
                                    return false;
                                }

                                if (htmlElement.nodeName.toLowerCase() !== "qp-fieldset") {
                                    return false;
                                }

                                const child: QPFieldset = {
                                    Type: AcuElementType.QPFieldSet,
                                    Children: [],
                                };

                                (parent as AcuContainer).Children.push(child);

                                VisitChildren(htmlElement, child);

                                return true;
                            }
                        }

                        class TextEditVisitor implements ElementVisitor {
                            visit(htmlElement: ChildNode, parent: AcuElement): boolean {
                                if (parent.Type !== AcuElementType.QPField) {
                                    return false;
                                }

                                if (htmlElement.nodeName.toLowerCase() !== "input") {
                                    return false;
                                }

                                //(parent as QPField).Value = "some-edit-value";
                                (parent as QPField).ElementType = QPFieldElementType.TextEditor;

                                VisitChildren(htmlElement, parent);

                                return true;
                            }
                        }

                        function Visit(htmlElement: ChildNode, parent: AcuElement) {
                            for (const visitor of AllVisitors) {
                                if (visitor.visit(htmlElement, parent)) {
                                    return;
                                }
                            }
                            VisitChildren(htmlElement, parent);
                        }

                        function VisitChildren(htmlElement: ChildNode, parent: AcuElement) {
                            htmlElement.childNodes.forEach(child => Visit(child as HTMLElement, parent));
                        }

                        const AllVisitors: Array<ElementVisitor> = [
                            new QPFieldsetVisitor(),
                            new QPFieldVisitor(),
                            new LabelVisitor(),
                            new TextEditVisitor(),
                        ];

                        class AcuPageParser {
                            parse(html: string): string | null {
                                return "hello";
                                // const doc = new DOMParser().parseFromString(html, 'text/html');
                                // const node = doc.body.firstChild;
                                //
                                // if(!node) {
                                //     return null;
                                // }
                                //
                                // const root: AcuContainer = {
                                //     Type: AcuElementType.Root,
                                //     Children: [],
                                // }
                                //
                                // Visit(node!, root);
                                // return root;
                            }
                        }

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

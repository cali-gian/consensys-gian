import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Excalidraw from '@excalidraw/excalidraw';

window.EXCALIDRAW_ASSET_PATH = '/';

window.webui = {
    execute: (...arrowIds) => {
        for (const it of arrowIds) {
            const xit = helpers.getArrowText(it);
            if (macros[xit]) {
                macros[xit]();
            }
            console.log('done', it, xit)
        }
    },
}

window.helpers = {
    getArrowText(it) {
        let xit = ea.getSceneElements().find(et => et.id == it);
        if (!xit) {
            xit = window.metaElements.find(et => et.id == it);
        }
        let tixit;
        if (xit.type == 'meta') {
            tixit = xit.boundElements.find(et => et.type == 'text')
        } else {
            const ixit = xit.boundElements.find(et => et.type == 'text').id;
            tixit = ea.getSceneElements().find(et => et.id == ixit);
        }
        return tixit.text;
    },
}

window.macros = {}

window.metaElements = []

window.onload = async function () {
    try {
        const path = window.location.pathname;
        let username = 'cali-gian';
        let layerName = 'gc-consensys';

        if (path && path !== '/') {
            // Remove the leading slash and split the path
            const pathParts = path.substring(1).split('/');
            if (pathParts.length === 2) {
                // Expecting a path like "/username/layerName"
                username = pathParts[0];
                layerName = pathParts[1];
            } else {
                throw 'Invalid path format. Expected format: /username/layerName';
                return;
            }
        }

        const layerScriptUrl = `https://${username}.github.io/my-galaxy-layers/${layerName}.js`;

        const layerScriptTag = document.createElement('script');
        layerScriptTag.src = layerScriptUrl;
        layerScriptTag.type = 'text/javascript';
        layerScriptTag.onload = initializeExcalidraw;
        layerScriptTag.onerror = function () {
            console.error('Layer not found, loading default layer.');
            // Defaulting if the requested layer isn't found
            const defaultLayerScriptUrl = `https://galaxy-browser.vercel.app/cali-gian/gc-consensys`;
            const defaultLayerScriptTag = document.createElement('script');
            defaultLayerScriptTag.src = defaultLayerScriptUrl;
            defaultLayerScriptTag.type = 'text/javascript';
            defaultLayerScriptTag.onload = initializeExcalidraw;
            defaultLayerScriptTag.onerror = () => {
                alert('Default layer also could not be loaded.');
            };
            document.body.appendChild(defaultLayerScriptTag);
        };
        document.body.appendChild(layerScriptTag);
    } catch (err) {
        console.error(err);
        alert(err);
    }
};

function initializeExcalidraw() {
    if (typeof React === "undefined" || typeof ReactDOM === "undefined") {
        console.error('React and ReactDOM must be loaded before this script.');
        return;
    }

    const App = () => {
        useEffect(() => {
            const checkEaExists = setInterval(() => {
                if (window.ea) {
                    clearInterval(checkEaExists);

                    // Set the initial zoom level to 10%
                    const zoomButton = document.querySelector('.reset-zoom-button');
                    if (zoomButton) {
                        zoomButton.innerHTML = "10%";
                    }

                    window.ea.updateScene({
                        elements,
                        appState: {
                            viewModeEnabled: true,
                        },
                    });

                    setTimeout(() => {
                        window.ea.updateScene({
                            appState: { selectedElementIds: { ['blackhole']: false } },
                            elements: elements.map(it => {
                                return { ...it }
                            })
                        })

                        setTimeout(() => {
                            ea.updateScene({
                                elements: ea.getSceneElements().map(it => {
                                    return { ...it }
                                })
                            });
                        }, 1000);
                    }, 100);

                    if (window.files) {
                        ea.addFiles(Object.keys(window.files).map(it => {
                            return window.files[it]
                        }))
                    }

                    window.ea.scrollToContent();

                    if (window.layerTitle) document.title = `Galaxy | ${window.layerTitle}`;
                }
            }, 100);

            return () => clearInterval(checkEaExists);
        }, []);

        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                {
                    style: { height: "100vh", width: "100vw" },
                },
                React.createElement(ExcalidrawLib.Excalidraw),
            ),
        );
    };

    const excalidrawWrapper = document.getElementById("app");
    const root = ReactDOM.createRoot(excalidrawWrapper);
    root.render(React.createElement(App));
};

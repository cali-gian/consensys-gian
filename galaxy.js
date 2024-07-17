import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
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
            const pathParts = path.substring(1).split('/');
            if (pathParts.length === 2) {
                username = pathParts[0];
                layerName = pathParts[1];
            } else {
                throw 'Invalid path format. Expected format: /username/layerName';
            }
        }

        const layerScriptUrl = `https://${username}.github.io/my-galaxy-layers/${layerName}.js`;

        const layerScriptTag = document.createElement('script');
        layerScriptTag.src = layerScriptUrl;
        layerScriptTag.type = 'text/javascript';
        layerScriptTag.onload = initializeExcalidraw;
        layerScriptTag.onerror = function () {
            console.error('Layer not found, loading default layer.');
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
    const App = () => {
        useEffect(() => {
            const checkEaExists = setInterval(() => {
                if (window.ea) {
                    clearInterval(checkEaExists);

                    // Ensure Excalidraw is ready before setting the zoom
                    window.ea.updateScene({
                        elements,
                        appState: {
                            viewModeEnabled: true,
                            zoom: {
                                value: 0.1, // Set initial zoom to 10%
                                translation: { x: 0, y: 0 }
                            }
                        },
                    });

                    if (window.files) {
                        window.ea.addFiles(Object.keys(window.files).map(it => window.files[it]));
                    }

                    window.ea.scrollToContent();

                    if (window.layerTitle) document.title = `Galaxy | ${window.layerTitle}`;
                }
            }, 100);

            return () => clearInterval(checkEaExists);
        }, []);

        return (
            <div style={{ height: "100vh", width: "100vw" }}>
                <Excalidraw />
            </div>
        );
    };

    const excalidrawWrapper = document.getElementById("app");
    const root = ReactDOM.createRoot(excalidrawWrapper);
    root.render(<App />);
}

window.onload = initializeExcalidraw;

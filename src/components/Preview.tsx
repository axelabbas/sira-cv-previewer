import { useEffect, useRef, useMemo, forwardRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { updateIframeContent, debounce } from '../utils';
import './Preview.css';

const Preview = forwardRef<HTMLIFrameElement>((_props, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { html, previewMode, previewData } = useEditorStore();

    // Use forwarded ref or internal ref
    const actualRef = (ref as React.RefObject<HTMLIFrameElement>) || iframeRef;

    // Debounced update function
    const updatePreview = useMemo(
        () =>
            debounce((htmlContent: string, preview: boolean, data: Record<string, unknown>) => {
                if (actualRef.current) {
                    updateIframeContent(actualRef.current, htmlContent, preview, data);
                }
            }, 300),
        [actualRef]
    );

    useEffect(() => {
        updatePreview(html, previewMode, previewData);
    }, [html, previewMode, previewData, updatePreview]);

    return (
        <div className="preview-container">
            <div className="preview-header">
                <h3>Live Preview</h3>
                <span className="preview-info">
                    {previewMode ? 'Showing with sample data' : 'Showing template syntax'}
                </span>
            </div>
            <div className="preview-wrapper">
                <iframe
                    ref={actualRef}
                    className="preview-iframe"
                    title="HTML Preview"
                    sandbox="allow-same-origin allow-scripts"
                />
            </div>
        </div>
    );
});

Preview.displayName = 'Preview';

export default Preview;

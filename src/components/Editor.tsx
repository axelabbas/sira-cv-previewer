import Editor from '@monaco-editor/react';
import { useEditorStore } from '../store/editorStore';
import './Editor.css';

export default function CodeEditor() {
    const { html, setHtml } = useEditorStore();

    const editorTheme = 'vs-dark';

    return (
        <div className="editor-container">
            <div className="editor-header">
                <h3>HTML Template</h3>
                <span className="editor-hint">Embed CSS within &lt;style&gt; tags</span>
            </div>

            <div className="editor-wrapper">
                <Editor
                    height="100%"
                    defaultLanguage="html"
                    value={html}
                    theme={editorTheme}
                    onChange={(value) => setHtml(value || '')}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                    }}
                />
            </div>
        </div>
    );
}

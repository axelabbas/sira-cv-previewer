import { useEffect, useRef } from 'react';
import Toolbar from './components/Toolbar';
import CodeEditor from './components/Editor';
import Preview from './components/Preview';
import ResizablePanel from './components/ResizablePanel';
import './App.css';

function App() {
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Always set to dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <div className="app">
      <Toolbar previewIframeRef={previewIframeRef} />
      <div className="main-content">
        <ResizablePanel
          leftPanel={<CodeEditor />}
          rightPanel={<Preview ref={previewIframeRef} />}
          defaultLeftWidth={50}
          minWidth={30}
          maxWidth={70}
        />
      </div>
    </div>
  );
}

export default App;

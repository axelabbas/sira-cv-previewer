import { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { exportAsJinjaTemplate, exportCVAsImage } from '../utils';
import PreviewDataEditor from './PreviewDataEditor';
import './Toolbar.css';

interface ToolbarProps {
  previewIframeRef?: React.RefObject<HTMLIFrameElement | null>;
}

export default function Toolbar({ previewIframeRef }: ToolbarProps) {
  const { html, previewMode, setPreviewMode, reset } = useEditorStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    exportAsJinjaTemplate(html);
  };

  const handleExportWithImage = async () => {
    if (!previewIframeRef?.current) {
      alert('Preview not available. Please try again.');
      return;
    }

    setIsExporting(true);
    try {
      // Export the template first
      exportAsJinjaTemplate(html);
      
      // Wait a bit for the first download to start
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Then export the CV image
      await exportCVAsImage(previewIframeRef.current);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to the example template? This will discard your current changes.')) {
      reset();
    }
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-left">
          <h1 className="toolbar-title">CV Template Editor</h1>
          <span className="toolbar-subtitle">Live HTML Editor with Jinja Support</span>
        </div>
        
        <div className="toolbar-right">
          <button 
            className="toolbar-button edit-data-button"
            onClick={() => setIsEditorOpen(true)}
            title="Edit preview data"
          >
            ⚙️ Edit Data
          </button>

          <button 
            className={`toolbar-button preview-toggle ${previewMode ? 'active' : ''}`}
            onClick={togglePreview}
            title={previewMode ? 'Hide preview data' : 'Show preview data'}
          >
            {previewMode ? '👁️ Preview: ON' : '👁️ Preview: OFF'}
          </button>
          
          <button className="toolbar-button reset-button" onClick={handleReset}>
            🔄 Reset Example
          </button>
          
          <button className="toolbar-button export-button" onClick={handleExport}>
            � Export Template
          </button>

          <button 
            className="toolbar-button export-button" 
            onClick={handleExportWithImage}
            disabled={isExporting}
            title="Export both template and CV image"
          >
            {isExporting ? '⏳ Exporting...' : '📥 Export Template + Image'}
          </button>
        </div>
      </div>

      <PreviewDataEditor isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
    </>
  );
}

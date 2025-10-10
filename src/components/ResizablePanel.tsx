import { useState, useRef, useEffect } from 'react';
import './ResizablePanel.css';

interface ResizablePanelProps {
    leftPanel: React.ReactNode;
    rightPanel: React.ReactNode;
    defaultLeftWidth?: number;
    minWidth?: number;
    maxWidth?: number;
}

export default function ResizablePanel({
    leftPanel,
    rightPanel,
    defaultLeftWidth = 50,
    minWidth = 30,
    maxWidth = 70,
}: ResizablePanelProps) {
    const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

            // Clamp the value between min and max
            const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newLeftWidth));
            setLeftWidth(clampedWidth);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, minWidth, maxWidth]);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    return (
        <div className="resizable-container" ref={containerRef}>
            <div className="resizable-left" style={{ width: `${leftWidth}%` }}>
                {leftPanel}
            </div>

            <div
                className={`resizable-divider ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
            >
                <div className="divider-handle" />
            </div>

            <div className="resizable-right" style={{ width: `${100 - leftWidth}%` }}>
                {rightPanel}
            </div>
        </div>
    );
}

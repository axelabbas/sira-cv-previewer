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
    const minWidthRef = useRef(minWidth);
    const maxWidthRef = useRef(maxWidth);

    // Update refs when props change
    useEffect(() => {
        minWidthRef.current = minWidth;
        maxWidthRef.current = maxWidth;
    }, [minWidth, maxWidth]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            e.preventDefault();
            
            const containerRect = containerRef.current.getBoundingClientRect();
            const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

            // Clamp the value between min and max
            const clampedWidth = Math.max(
                minWidthRef.current, 
                Math.min(maxWidthRef.current, newLeftWidth)
            );
            
            setLeftWidth(clampedWidth);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    return (
        <div className="resizable-container" ref={containerRef}>
            <div 
                className="resizable-left" 
                style={{ 
                    width: `calc(${leftWidth}% - 4px)`,
                    pointerEvents: isDragging ? 'none' : 'auto'
                }}
            >
                {leftPanel}
            </div>

            <div
                className={`resizable-divider ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
            >
                <div className="divider-handle" />
            </div>

            <div 
                className="resizable-right" 
                style={{ 
                    width: `calc(${100 - leftWidth}% - 4px)`,
                    pointerEvents: isDragging ? 'none' : 'auto'
                }}
            >
                {rightPanel}
            </div>
        </div>
    );
}

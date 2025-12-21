import { useState, useEffect, useCallback } from 'react';

interface DebugCursorProps {
  onClose: () => void;
}

export function DebugCursor({ onClose }: DebugCursorProps) {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [isSelecting, setIsSelecting] = useState(true);

  const getSelector = (el: Element): string => {
    if (el.id) return `#${el.id}`;
    
    const classes = Array.from(el.classList).filter(c => 
      !c.startsWith('debug-') && c !== 'cursor-target'
    );
    
    const tag = el.tagName.toLowerCase();
    const classStr = classes.length > 0 ? `.${classes.slice(0, 2).join('.')}` : '';
    
    return `${tag}${classStr}`;
  };

  const handleClick = useCallback((e: MouseEvent) => {
    if (!isSelecting) return;
    
    const target = e.target as Element;
    if (target.closest('.debug-panel')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const selector = getSelector(target);
    const hasClass = target.classList.contains('cursor-target');
    
    if (hasClass) {
      target.classList.remove('cursor-target');
      setSelectedElements(prev => prev.filter(s => s !== selector));
    } else {
      target.classList.add('cursor-target');
      setSelectedElements(prev => [...new Set([...prev, selector])]);
    }
  }, [isSelecting]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    if (!isSelecting) return;
    const target = e.target as Element;
    if (target.closest('.debug-panel')) return;
    
    if (hoveredElement && hoveredElement !== target) {
      hoveredElement.classList.remove('debug-hover');
    }
    target.classList.add('debug-hover');
    setHoveredElement(target);
  }, [isSelecting, hoveredElement]);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    target.classList.remove('debug-hover');
  }, []);

  useEffect(() => {
    if (!isSelecting) return;
    
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      if (hoveredElement) {
        hoveredElement.classList.remove('debug-hover');
      }
    };
  }, [handleClick, handleMouseOver, handleMouseOut, isSelecting, hoveredElement]);

  const copySelectors = () => {
    const allTargets = document.querySelectorAll('.cursor-target');
    const selectors = Array.from(allTargets).map(el => getSelector(el));
    const unique = [...new Set(selectors)];
    const output = unique.join(', ');
    navigator.clipboard.writeText(output);
    alert(`Copied: ${output}`);
  };

  const clearAll = () => {
    document.querySelectorAll('.cursor-target').forEach(el => {
      el.classList.remove('cursor-target');
    });
    setSelectedElements([]);
  };

  return (
    <>
      <style>{`
        .debug-hover {
          outline: 2px dashed #ff6b6b !important;
          outline-offset: 2px !important;
        }
        .cursor-target {
          outline: 2px solid #4ecdc4 !important;
          outline-offset: 2px !important;
        }
      `}</style>
      
      <div className="debug-panel fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg z-[10000] max-w-sm font-mono text-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">Cursor Target Debug</h3>
          <button onClick={onClose} className="text-red-400 hover:text-red-300">✕</button>
        </div>
        
        <div className="mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isSelecting} 
              onChange={(e) => setIsSelecting(e.target.checked)}
              className="w-4 h-4"
            />
            Selection mode {isSelecting ? '(ON)' : '(OFF)'}
          </label>
        </div>
        
        <div className="mb-3 text-xs text-gray-400">
          {isSelecting ? 'Click elements to toggle cursor-target' : 'Selection paused'}
        </div>
        
        <div className="mb-3 max-h-32 overflow-y-auto">
          <div className="text-xs text-gray-400 mb-1">Selected ({selectedElements.length}):</div>
          {selectedElements.length === 0 ? (
            <div className="text-gray-500 text-xs">None</div>
          ) : (
            selectedElements.map((sel, i) => (
              <div key={i} className="text-green-400 text-xs truncate">{sel}</div>
            ))
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={copySelectors}
            className="flex-1 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-xs"
          >
            Copy All
          </button>
          <button 
            onClick={clearAll}
            className="flex-1 bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded text-xs"
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
}

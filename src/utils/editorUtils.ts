/**
 * Inject preview data into Jinja template syntax
 */
export function injectPreviewData(html: string, previewData: Record<string, unknown>): string {
  // Helper function to get nested property value
  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((current: unknown, key: string) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };

  // Helper to evaluate Jinja filters
  const applyFilters = (value: unknown, filters: string): unknown => {
    const filterList = filters.split('|').map(f => f.trim()).filter(f => f);
    let result = value;
    
    for (const filter of filterList) {
      if (filter === 'length') {
        result = Array.isArray(result) ? result.length : 0;
      }
      // Add more filters as needed
    }
    
    return result;
  };

  // Helper to evaluate a condition
  const evaluateCondition = (condition: string, context: Record<string, unknown>): boolean => {
    const trimmed = condition.trim();
    
    // Handle logical AND operator
    if (trimmed.includes(' and ')) {
      const parts = trimmed.split(' and ').map(p => p.trim());
      const results = parts.map(part => evaluateCondition(part, context));
      return results.every(r => r);
    }
    
    // Handle logical OR operator
    if (trimmed.includes(' or ')) {
      const parts = trimmed.split(' or ').map(p => p.trim());
      const results = parts.map(part => evaluateCondition(part, context));
      return results.some(r => r);
    }
    
    // Handle filters like "array|length > 0"
    const filterMatch = trimmed.match(/^(.+?)\|(.+?)$/);
    if (filterMatch) {
      const [, varPath, filters] = filterMatch;
      const value = getNestedValue(context, varPath.trim());
      const filtered = applyFilters(value, filters);
      
      // Check for comparisons after filter
      const compMatch = filters.match(/(length)\s*(>|<|>=|<=|==|!=)\s*(\d+)/);
      if (compMatch) {
        const [, , operator, num] = compMatch;
        const numValue = parseInt(num, 10);
        const length = Array.isArray(value) ? value.length : 0;
        
        switch (operator) {
          case '>': return length > numValue;
          case '<': return length < numValue;
          case '>=': return length >= numValue;
          case '<=': return length <= numValue;
          case '==': return length === numValue;
          case '!=': return length !== numValue;
          default: return length > 0;
        }
      }
      
      return !!filtered;
    }
    
    // Handle 'not' operator
    if (trimmed.startsWith('not ')) {
      const innerCondition = trimmed.substring(4).trim();
      return !evaluateCondition(innerCondition, context);
    }
    
    // Simple variable check
    const value = getNestedValue(context, trimmed);
    if (value === undefined || value === null) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.length > 0;
    if (typeof value === 'number') return value !== 0;
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  };

  // Find matching endfor for a given startfor position
  const findMatchingEndfor = (template: string, startPos: number): number => {
    let depth = 1;
    let pos = startPos;
    const forRegex = /{%\s*for\s+/g;
    const endforRegex = /{%\s*endfor\s*%}/g;
    
    while (depth > 0 && pos < template.length) {
      forRegex.lastIndex = pos;
      endforRegex.lastIndex = pos;
      
      const nextFor = forRegex.exec(template);
      const nextEndfor = endforRegex.exec(template);
      
      if (!nextEndfor) return -1;
      
      if (nextFor && nextFor.index < nextEndfor.index) {
        depth++;
        pos = forRegex.lastIndex;
      } else {
        depth--;
        if (depth === 0) return nextEndfor.index;
        pos = endforRegex.lastIndex;
      }
    }
    
    return -1;
  };

  // Find matching endif for a given if position
  const findMatchingEndif = (template: string, startPos: number): { endifPos: number; elifPositions: number[] } => {
    let depth = 1;
    let pos = startPos;
    const elifPositions: number[] = [];
    const ifRegex = /{%\s*if\s+/g;
    const elifRegex = /{%\s*elif\s+/g;
    const endifRegex = /{%\s*endif\s*%}/g;
    
    while (depth > 0 && pos < template.length) {
      ifRegex.lastIndex = pos;
      elifRegex.lastIndex = pos;
      endifRegex.lastIndex = pos;
      
      const nextIf = ifRegex.exec(template);
      const nextElif = elifRegex.exec(template);
      const nextEndif = endifRegex.exec(template);
      
      if (!nextEndif) return { endifPos: -1, elifPositions };
      
      // Find the closest match
      const candidates = [
        nextIf ? { type: 'if', pos: nextIf.index } : null,
        nextElif && depth === 1 ? { type: 'elif', pos: nextElif.index } : null,
        { type: 'endif', pos: nextEndif.index }
      ].filter(c => c !== null) as Array<{ type: string; pos: number }>;
      
      candidates.sort((a, b) => a.pos - b.pos);
      const next = candidates[0];
      
      if (next.type === 'if') {
        depth++;
        pos = next.pos + 1;
      } else if (next.type === 'elif') {
        elifPositions.push(next.pos);
        pos = next.pos + 1;
      } else {
        depth--;
        if (depth === 0) return { endifPos: nextEndif.index, elifPositions };
        pos = nextEndif.index + 1;
      }
    }
    
    return { endifPos: -1, elifPositions };
  };

  // Recursive function to process template with given data context
  const processTemplate = (template: string, context: Record<string, unknown>): string => {
    let result = template;
    let changed = true;
    
    // Process FOR loops
    while (changed) {
      changed = false;
      
      const forMatch = /{%\s*for\s+(\w+)\s+in\s+([^%]+?)\s*%}/g.exec(result);
      if (forMatch) {
        const startTag = forMatch[0];
        const itemName = forMatch[1];
        let arrayPath = forMatch[2].trim();
        const startPos = forMatch.index;
        const contentStart = startPos + startTag.length;
        
        // Remove filters from array path for lookup
        arrayPath = arrayPath.split('|')[0].trim();
        
        const endforPos = findMatchingEndfor(result, contentStart);
        if (endforPos !== -1) {
          const content = result.substring(contentStart, endforPos);
          const endTag = /{%\s*endfor\s*%}/;
          const endTagMatch = result.substring(endforPos).match(endTag);
          const endTagLength = endTagMatch ? endTagMatch[0].length : 0;
          
          const arrayData = getNestedValue(context, arrayPath);
          let replacement = '';
          
          if (Array.isArray(arrayData) && arrayData.length > 0) {
            replacement = arrayData.map((item) => {
              const itemContext = {
                ...context,
                [itemName]: item
              };
              
              let itemContent = processTemplate(content, itemContext);
              
              itemContent = itemContent.replace(new RegExp(`{{\\s*${itemName}\\.([^}]+?)\\s*}}`, 'g'), (m: string, prop: string) => {
                if (item && typeof item === 'object' && prop in item) {
                  return String((item as Record<string, unknown>)[prop]);
                }
                return m;
              });
              
              itemContent = itemContent.replace(new RegExp(`{{\\s*${itemName}\\s*}}`, 'g'), String(item));
              
              return itemContent;
            }).join('');
          }
          
          result = result.substring(0, startPos) + replacement + result.substring(endforPos + endTagLength);
          changed = true;
        }
      }
    }

    // Replace variables {{ variable }}
    result = result.replace(/{{\s*([^}]+?)\s*}}/g, (match, variable) => {
      const trimmed = variable.trim();
      const value = getNestedValue(context, trimmed);
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          return JSON.stringify(value);
        }
        return String(value);
      }
      return match;
    });

    // Process IF/ELIF/ENDIF conditionals
    changed = true;
    while (changed) {
      changed = false;
      const ifMatch = /{%\s*if\s+([^%]+?)\s*%}/g.exec(result);
      if (ifMatch) {
        const condition = ifMatch[1];
        const startPos = ifMatch.index;
        const startTag = ifMatch[0];
        const contentStart = startPos + startTag.length;
        
        const { endifPos, elifPositions } = findMatchingEndif(result, contentStart);
        if (endifPos !== -1) {
          const endTag = /{%\s*endif\s*%}/;
          const endTagMatch = result.substring(endifPos).match(endTag);
          const endTagLength = endTagMatch ? endTagMatch[0].length : 0;
          
          let replacement = '';
          
          // Check main if condition
          if (evaluateCondition(condition, context)) {
            const contentEnd = elifPositions.length > 0 ? elifPositions[0] : endifPos;
            const content = result.substring(contentStart, contentEnd);
            replacement = processTemplate(content, context);
          } else {
            // Check elif conditions
            for (let i = 0; i < elifPositions.length; i++) {
              const elifPos = elifPositions[i];
              const elifMatch = result.substring(elifPos).match(/{%\s*elif\s+([^%]+?)\s*%}/);
              if (elifMatch) {
                const elifCondition = elifMatch[1];
                const elifContentStart = elifPos + elifMatch[0].length;
                const elifContentEnd = i < elifPositions.length - 1 ? elifPositions[i + 1] : endifPos;
                
                if (evaluateCondition(elifCondition, context)) {
                  const content = result.substring(elifContentStart, elifContentEnd);
                  replacement = processTemplate(content, context);
                  break;
                }
              }
            }
          }
          
          result = result.substring(0, startPos) + replacement + result.substring(endifPos + endTagLength);
          changed = true;
        }
      }
    }

    return result;
  };

  return processTemplate(html, previewData);
}

/**
 * Highlights Jinja template syntax in HTML by wrapping variables and blocks in styled spans
 */
export function highlightJinjaSyntax(html: string): string {
  // Highlight Jinja variables {{ ... }}
  let highlighted = html.replace(
    /{{\s*([^}]+?)\s*}}/g,
    '<span class="jinja-variable" data-jinja="variable">{{ $1 }}</span>'
  );

  // Highlight Jinja block tags {% ... %}
  highlighted = highlighted.replace(
    /{%\s*([^%]+?)\s*%}/g,
    '<span class="jinja-block" data-jinja="block">{% $1 %}</span>'
  );

  return highlighted;
}

/**
 * Debounce function to limit how often a function is called
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Export the current HTML and CSS as a Jinja template file
 */
export function exportAsJinjaTemplate(html: string): void {
  // HTML already contains embedded CSS, just export as-is
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cv-template.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Inject CSS and HTML into an iframe for preview
 */
export function updateIframeContent(
  iframe: HTMLIFrameElement,
  html: string,
  previewMode: boolean = false,
  previewData?: Record<string, unknown>
): void {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;

  let processedHtml = html;

  // If preview mode is enabled and we have data, inject it
  if (previewMode && previewData) {
    processedHtml = injectPreviewData(html, previewData);
  } else {
    // Otherwise, just highlight the Jinja syntax
    processedHtml = highlightJinjaSyntax(html);
  }

  // Inject CSS for Jinja highlighting (only if not in preview mode)
  const jinjaStyles = previewMode ? '' : `
    <style>
      .jinja-variable {
        background-color: rgba(255, 193, 7, 0.2);
        border-radius: 3px;
        padding: 2px 4px;
        font-family: 'Courier New', monospace;
        font-size: 0.95em;
        border: 1px solid rgba(255, 193, 7, 0.4);
        display: inline-block;
      }
      
      .jinja-block {
        background-color: rgba(76, 175, 80, 0.2);
        border-radius: 3px;
        padding: 2px 4px;
        font-family: 'Courier New', monospace;
        font-size: 0.95em;
        border: 1px solid rgba(76, 175, 80, 0.4);
        display: inline-block;
      }
    </style>
  `;

  // Inject Jinja highlighting styles if not in preview mode
  let finalHtml = processedHtml;
  if (!previewMode && jinjaStyles) {
    // Insert before the closing </head> tag or at the beginning of <body>
    if (finalHtml.includes('</head>')) {
      finalHtml = finalHtml.replace('</head>', `${jinjaStyles}\n  </head>`);
    } else if (finalHtml.includes('<body>')) {
      finalHtml = finalHtml.replace('<body>', `<body>\n${jinjaStyles}`);
    } else {
      finalHtml = jinjaStyles + finalHtml;
    }
  }

  iframeDoc.open();
  iframeDoc.write(finalHtml);
  iframeDoc.close();
}

/**
 * Export CV as an image using html2canvas
 */
export async function exportCVAsImage(iframe: HTMLIFrameElement): Promise<void> {
  try {
    // Dynamically import html2canvas
    const html2canvas = (await import('html2canvas')).default;
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframeDoc.body) {
      throw new Error('Unable to access iframe content');
    }

    // Capture the iframe content
    const canvas = await html2canvas(iframeDoc.body, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
    });

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to create image blob');
        return;
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `cv-${timestamp}.png`;
      link.href = url;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Error exporting CV as image:', error);
    alert('Failed to export CV as image. Please try again.');
  }
}

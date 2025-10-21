/**
 * Inject preview data into Jinja template syntax
 */
export function injectPreviewData(html: string, previewData: Record<string, unknown>): string {
  // Helper function to get nested property value
  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    // Tokenize the path into dot parts and bracket selectors
    // Supports: a.b, a[0], a[2:], a[:3], a[1:4], a[idx]
    const tokens: Array<{ type: 'prop' | 'bracket'; value: string }> = [];
    const regex = /(\w+)|(\[(.*?)\])/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(path)) !== null) {
      if (match[1]) {
        tokens.push({ type: 'prop', value: match[1] });
      } else if (match[3] !== undefined) {
        tokens.push({ type: 'bracket', value: match[3].trim() });
      }
    }

    let current: unknown = obj;
    for (const token of tokens) {
      if (token.type === 'prop') {
        if (current && typeof current === 'object' && token.value in (current as Record<string, unknown>)) {
          current = (current as Record<string, unknown>)[token.value];
        } else {
          return undefined;
        }
      } else {
        // bracket token
        const selector = token.value;
        if (selector.includes(':')) {
          // Slice
          if (!Array.isArray(current)) return undefined;
          const [startStr, endStr] = selector.split(':').map(s => s.trim());
          const start = startStr === '' ? 0 : isNaN(Number(startStr)) ? Number(getNestedValue(obj, startStr) as number) : Number(startStr);
          const end = endStr === '' ? (current as unknown[]).length : isNaN(Number(endStr)) ? Number(getNestedValue(obj, endStr) as number) : Number(endStr);
          current = (current as unknown[]).slice(isNaN(start) ? 0 : start, isNaN(end) ? (current as unknown[]).length : end);
        } else {
          // Index
          if (!Array.isArray(current)) return undefined;
          const idxStr = selector;
          let idx: number;
          if (/^-?\d+$/.test(idxStr)) {
            idx = parseInt(idxStr, 10);
          } else {
            const v = getNestedValue(obj, idxStr);
            idx = typeof v === 'number' ? v : parseInt(String(v ?? NaN), 10);
          }
          const arr = current as unknown[];
          if (idx < 0) idx = arr.length + idx; // support negative index
          current = arr[idx];
        }
      }
    }
    return current;
  };

  // Helper to evaluate Jinja filters
  const applyFilters = (value: unknown, filters: string): unknown => {
    const filterList = filters.split('|').map(f => f.trim()).filter(f => f);
    let result = value;
    
    for (const filterExpr of filterList) {
      // Handle filter with arguments like join('  |  ')
      const filterMatch = filterExpr.match(/^(\w+)(?:\((.*?)\))?$/);
      if (!filterMatch) continue;
      
      const [, filterName, filterArgs] = filterMatch;
      
      switch (filterName) {
        case 'length':
          result = Array.isArray(result) ? result.length : 0;
          break;
        case 'join':
          if (Array.isArray(result)) {
            // Extract the join separator from quotes
            const separator = filterArgs?.replace(/^['"]|['"]$/g, '') || '';
            result = result.join(separator);
          }
          break;
        case 'upper':
          result = String(result).toUpperCase();
          break;
        case 'lower':
          result = String(result).toLowerCase();
          break;
        case 'title':
          result = String(result).replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
          break;
        case 'default':
          if (!result || result === '' || result === null || result === undefined) {
            result = filterArgs?.replace(/^['"]|['"]$/g, '') || '';
          }
          break;
      }
    }
    
    return result;
  };

  // Helper to evaluate a condition
  const evaluateCondition = (condition: string, context: Record<string, unknown>): boolean => {
    const trimmed = condition.trim();

    // Helper to evaluate an operand which might be a variable, filtered value, method call, string or number
    const evalOperand = (expr: string): unknown => {
      const e = expr.trim();
      // Quoted string
      if ((e.startsWith('"') && e.endsWith('"')) || (e.startsWith("'") && e.endsWith("'"))) {
        const inner = e.slice(1, -1)
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t');
        return inner;
      }
      // Boolean
      if (e === 'true') return true;
      if (e === 'false') return false;
      // Number
      if (/^-?\d+(?:\.\d+)?$/.test(e)) return Number(e);
      // Method calls like var.strip()
      const methodMatch = e.match(/^(.+?)\.(\w+)\(\)$/);
      if (methodMatch) {
        const [, varPath, methodName] = methodMatch;
        let value = getNestedValue(context, varPath.trim()) as unknown;
        if (typeof value === 'string') {
          if (methodName === 'strip') value = value.trim();
          else if (methodName === 'upper') value = value.toUpperCase();
          else if (methodName === 'lower') value = value.toLowerCase();
        }
        return value;
      }
      // Filters like var|length
      if (e.includes('|')) {
        const [varPath, ...filterParts] = e.split('|');
        const filters = filterParts.join('|');
        const base = getNestedValue(context, varPath.trim());
        return applyFilters(base, filters.trim());
      }
      // Default: nested value resolution (with indexing support)
      return getNestedValue(context, e);
    };
    
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
    
    // Handle 'in' operator (e.g., "\\n" in entry.description or "\n" in entry.description)
    const inMatch = trimmed.match(/^["'](.+?)["']\s+in\s+(.+)$/);
    if (inMatch) {
      const [, searchStr, varPath] = inMatch;
      const value = getNestedValue(context, varPath.trim());
      if (typeof value === 'string') {
        // Unescape the search string - handle both \\n and \n
        const unescapedSearch = searchStr
          .replace(/\\\\n/g, '\n')  // Handle \\n (double backslash)
          .replace(/\\n/g, '\n')     // Handle \n (single backslash)
          .replace(/\\\\t/g, '\t')   // Handle \\t
          .replace(/\\t/g, '\t');    // Handle \t
        return value.includes(unescapedSearch);
      }
      return false;
    }

    // Generic comparisons like a <= 2, items|length > 0, loop.index == 1
    const compMatchGeneric = trimmed.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
    if (compMatchGeneric) {
      const [, leftExpr, operator, rightExpr] = compMatchGeneric;
      const leftVal = evalOperand(leftExpr);
      const rightVal = evalOperand(rightExpr);

      const toNumberIfPossible = (v: unknown): unknown => {
        if (typeof v === 'number') return v;
        if (typeof v === 'string' && /^-?\d+(?:\.\d+)?$/.test(v)) return Number(v);
        return v;
      };

      const l = toNumberIfPossible(leftVal);
      const r = toNumberIfPossible(rightVal);

      const eqLoose = (a: unknown, b: unknown) => {
        // Implement loose equality similar to JS, but without using 'any'
        if (typeof a === 'number' && typeof b === 'string' && /^-?\d+(?:\.\d+)?$/.test(b)) return a === Number(b);
        if (typeof b === 'number' && typeof a === 'string' && /^-?\d+(?:\.\d+)?$/.test(a)) return Number(a) === b;
        return a === b; // fall back to strict equality
      };

      const cmp = (a: unknown, b: unknown, op: string): boolean => {
        if (op === '==' ) return eqLoose(a, b);
        if (op === '!=' ) return !eqLoose(a, b);
        // For relational ops, only compare numbers or strings
        if (typeof a === 'number' && typeof b === 'number') {
          if (op === '>') return a > b;
          if (op === '<') return a < b;
          if (op === '>=') return a >= b;
          if (op === '<=') return a <= b;
        }
        if (typeof a === 'string' && typeof b === 'string') {
          if (op === '>') return a > b;
          if (op === '<') return a < b;
          if (op === '>=') return a >= b;
          if (op === '<=') return a <= b;
        }
        return false;
      };

      return cmp(l, r, operator);
    }
    
    // Handle filters like "array|length > 0" (legacy path, generic comparator above should handle most cases)
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
    
    // Handle method calls in conditions like line.strip()
    const methodMatch = trimmed.match(/^(.+?)\.(\w+)\(\)$/);
    if (methodMatch) {
      const [, varPath, methodName] = methodMatch;
      let value = getNestedValue(context, varPath.trim());
      
      // Apply string methods
      if (typeof value === 'string') {
        if (methodName === 'strip') {
          value = value.trim();
        } else if (methodName === 'upper') {
          value = value.toUpperCase();
        } else if (methodName === 'lower') {
          value = value.toLowerCase();
        }
      }
      
      // Check truthiness of the result
      if (value === undefined || value === null) return false;
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value.length > 0;
      if (typeof value === 'number') return value !== 0;
      if (Array.isArray(value)) return value.length > 0;
      return !!value;
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
  const findMatchingEndif = (template: string, startPos: number): { endifPos: number; elifPositions: number[]; elsePos: number } => {
    let depth = 1;
    let pos = startPos;
    const elifPositions: number[] = [];
    let elsePos = -1;
    const ifRegex = /{%\s*if\s+/g;
    const elifRegex = /{%\s*elif\s+/g;
    const elseRegex = /{%\s*else\s*%}/g;
    const endifRegex = /{%\s*endif\s*%}/g;
    
    while (depth > 0 && pos < template.length) {
      ifRegex.lastIndex = pos;
      elifRegex.lastIndex = pos;
      elseRegex.lastIndex = pos;
      endifRegex.lastIndex = pos;
      
      const nextIf = ifRegex.exec(template);
      const nextElif = elifRegex.exec(template);
      const nextElse = elseRegex.exec(template);
      const nextEndif = endifRegex.exec(template);
      
      if (!nextEndif) return { endifPos: -1, elifPositions, elsePos };
      
      // Find the closest match
      const candidates = [
        nextIf ? { type: 'if', pos: nextIf.index } : null,
        nextElif && depth === 1 ? { type: 'elif', pos: nextElif.index } : null,
        nextElse && depth === 1 ? { type: 'else', pos: nextElse.index } : null,
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
      } else if (next.type === 'else') {
        elsePos = next.pos;
        pos = next.pos + 1;
      } else {
        depth--;
        if (depth === 0) return { endifPos: nextEndif.index, elifPositions, elsePos };
        pos = nextEndif.index + 1;
      }
    }
    
    return { endifPos: -1, elifPositions, elsePos };
  };

  // Recursive function to process template with given data context
  const processTemplate = (template: string, context: Record<string, unknown>): string => {
    let result = template;
    let changed = true;

    // Remove Jinja comments {# ... #} first
    result = result.replace(/{#[\s\S]*?#}/g, '');

    // Process {% set %} statements first (variable assignments)
    result = result.replace(/{%\s*set\s+(\w+)\s*=\s*\[\s*\]\s*%}/g, (_match, varName) => {
      context[varName] = [];
      return ''; // Remove the set statement
    });

    result = result.replace(/{%\s*set\s+(\w+)\s*=\s*(.+?)\s*%}/g, (_match, varName, value) => {
      // Simple value assignment (not arrays)
      const trimmedValue = value.trim();
      if (trimmedValue.startsWith('"') || trimmedValue.startsWith("'")) {
        context[varName] = trimmedValue.slice(1, -1);
      } else {
        const resolved = getNestedValue(context, trimmedValue);
        context[varName] = resolved;
      }
      return ''; // Remove the set statement
    });

    // Process {% do %} statements (array operations, etc.)
    result = result.replace(/{%\s*do\s+(.+?)\s*%}/g, (_match, expression) => {
      // Handle array.append(value) operations
      const appendMatch = expression.match(/(\w+)\.append\((.+?)\)/);
      if (appendMatch) {
        const [, arrayName, valueExpr] = appendMatch;
        const array = context[arrayName];
        
        if (Array.isArray(array)) {
          // Evaluate the value expression
          const trimmedValue = valueExpr.trim();
          let valueToAppend: unknown;
          
          if (trimmedValue.startsWith('"') || trimmedValue.startsWith("'")) {
            // String literal
            valueToAppend = trimmedValue.slice(1, -1);
          } else {
            // Variable reference
            valueToAppend = getNestedValue(context, trimmedValue);
          }
          
          // Only append if value exists
          if (valueToAppend !== undefined && valueToAppend !== null && valueToAppend !== '') {
            array.push(valueToAppend);
          }
        }
      }
      
      return ''; // Remove the do statement
    });
    
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
        
        // Check if arrayPath includes a method call like .split()
        let arrayData: unknown;
        const methodMatch = arrayPath.match(/^(.+?)\.(\w+)\((.*?)\)$/);
        if (methodMatch) {
          const [, varPath, methodName, args] = methodMatch;
          const value = getNestedValue(context, varPath.trim());
          
          // Handle string methods
          if (typeof value === 'string') {
            if (methodName === 'split') {
              // Extract the delimiter from quotes
              const delimiter = args.replace(/^['"]|['"]$/g, '').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
              arrayData = value.split(delimiter);
            }
          }
        } else {
          arrayData = getNestedValue(context, arrayPath);
        }
        
        const endforPos = findMatchingEndfor(result, contentStart);
        if (endforPos !== -1) {
          const content = result.substring(contentStart, endforPos);
          const endTag = /{%\s*endfor\s*%}/;
          const endTagMatch = result.substring(endforPos).match(endTag);
          const endTagLength = endTagMatch ? endTagMatch[0].length : 0;
          
          let replacement = '';
          
          if (Array.isArray(arrayData) && arrayData.length > 0) {
            const length = arrayData.length;
            replacement = arrayData.map((item, idx) => {
              const loop = {
                index: idx + 1,
                index0: idx,
                first: idx === 0,
                last: idx === length - 1,
                length,
                revindex: length - idx,
                revindex0: length - idx - 1,
              };

              const itemContext = {
                ...context,
                [itemName]: item,
                loop,
              } as Record<string, unknown>;

              // Process inner content with extended context
              let itemContent = processTemplate(content, itemContext);

              // Fallback replacements for direct {{ item.prop }} and {{ item }}
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

    // Replace variables {{ variable }} with filter support
    result = result.replace(/{{\s*([^}]+?)\s*}}/g, (match, variable) => {
      const trimmed = variable.trim();
      
      // Check for method calls like line.strip()
      const methodMatch = trimmed.match(/^(.+?)\.(\w+)\(\)$/);
      if (methodMatch) {
        const [, varPath, methodName] = methodMatch;
        let value = getNestedValue(context, varPath.trim());
        
        // Apply string methods
        if (typeof value === 'string') {
          if (methodName === 'strip') {
            value = value.trim();
          } else if (methodName === 'upper') {
            value = value.toUpperCase();
          } else if (methodName === 'lower') {
            value = value.toLowerCase();
          }
        }
        
        if (value !== undefined && value !== null) {
          return String(value);
        }
        return match;
      }
      
      // Check if there are filters applied
      if (trimmed.includes('|')) {
        const parts = trimmed.split('|');
        const varPath = parts[0].trim();
        const filters = parts.slice(1).join('|').trim();
        
        let value = getNestedValue(context, varPath);
        
        // Apply all filters
        if (filters) {
          value = applyFilters(value, filters);
        }
        
        if (value !== undefined && value !== null) {
          return String(value);
        }
        return match;
      }
      
      // No filters, just get the value
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
        
        const { endifPos, elifPositions, elsePos } = findMatchingEndif(result, contentStart);
        if (endifPos !== -1) {
          const endTag = /{%\s*endif\s*%}/;
          const endTagMatch = result.substring(endifPos).match(endTag);
          const endTagLength = endTagMatch ? endTagMatch[0].length : 0;
          
          let replacement = '';
          
          // Check main if condition
          const conditionResult = evaluateCondition(condition, context);
          
          if (conditionResult) {
            // Determine where the if content ends (before elif, else, or endif)
            let contentEnd = endifPos;
            if (elifPositions.length > 0) {
              contentEnd = elifPositions[0];
            } else if (elsePos !== -1) {
              contentEnd = elsePos;
            }
            const content = result.substring(contentStart, contentEnd);
            replacement = processTemplate(content, context);
          } else {
            // Check elif conditions
            let elifMatched = false;
            for (let i = 0; i < elifPositions.length; i++) {
              const elifPos = elifPositions[i];
              const elifMatch = result.substring(elifPos).match(/{%\s*elif\s+([^%]+?)\s*%}/);
              if (elifMatch) {
                const elifCondition = elifMatch[1];
                const elifContentStart = elifPos + elifMatch[0].length;
                
                // Determine where this elif content ends
                let elifContentEnd = endifPos;
                if (i < elifPositions.length - 1) {
                  elifContentEnd = elifPositions[i + 1];
                } else if (elsePos !== -1) {
                  elifContentEnd = elsePos;
                }
                
                if (evaluateCondition(elifCondition, context)) {
                  const content = result.substring(elifContentStart, elifContentEnd);
                  replacement = processTemplate(content, context);
                  elifMatched = true;
                  break;
                }
              }
            }
            
            // If no elif matched and there's an else block, use it
            if (!elifMatched && elsePos !== -1) {
              const elseTag = /{%\s*else\s*%}/;
              const elseTagMatch = result.substring(elsePos).match(elseTag);
              const elseTagLength = elseTagMatch ? elseTagMatch[0].length : 0;
              const elseContentStart = elsePos + elseTagLength;
              const content = result.substring(elseContentStart, endifPos);
              replacement = processTemplate(content, context);
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

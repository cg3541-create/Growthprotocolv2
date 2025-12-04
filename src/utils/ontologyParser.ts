export interface ParsedEntity {
  id: string;
  type: string;
  description: string;
  attributes: string[];
}

export interface ParsedRelationship {
  from: string;
  to: string;
  relationship: string;
  description: string;
}

export interface ParsedOntology {
  entities: ParsedEntity[];
  relationships: ParsedRelationship[];
}

export interface ParseResult {
  success: boolean;
  data?: ParsedOntology;
  error?: string;
}

/**
 * Parse JSON ontology file
 */
export function parseJSONOntology(content: string): ParseResult {
  try {
    const json = JSON.parse(content);
    
    // Validate structure
    if (!json.ontology) {
      return {
        success: false,
        error: "Invalid JSON structure: missing 'ontology' property"
      };
    }

    const ontology = json.ontology;
    
    // Validate entities
    if (!Array.isArray(ontology.entities)) {
      return {
        success: false,
        error: "Invalid JSON structure: 'entities' must be an array"
      };
    }

    // Validate relationships
    if (!Array.isArray(ontology.relationships)) {
      return {
        success: false,
        error: "Invalid JSON structure: 'relationships' must be an array"
      };
    }

    // Parse entities
    const entities: ParsedEntity[] = ontology.entities.map((entity: any, index: number) => {
      if (!entity.type) {
        throw new Error(`Entity at index ${index} is missing 'type' property`);
      }
      
      return {
        id: entity.id || `E${Date.now()}-${index}`,
        type: entity.type,
        description: entity.description || "",
        attributes: Array.isArray(entity.attributes) ? entity.attributes : []
      };
    });

    // Parse relationships
    const relationships: ParsedRelationship[] = ontology.relationships.map((rel: any, index: number) => {
      if (!rel.from || !rel.to || !rel.relationship) {
        throw new Error(`Relationship at index ${index} is missing required properties (from, to, relationship)`);
      }
      
      return {
        from: rel.from,
        to: rel.to,
        relationship: rel.relationship,
        description: rel.description || ""
      };
    });

    return {
      success: true,
      data: {
        entities,
        relationships
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to parse JSON file"
    };
  }
}

/**
 * Parse CSV ontology file
 * Expected format:
 * - Entities CSV: id,type,description,attributes (attributes as comma-separated string)
 * - Relationships CSV: from,to,relationship,description
 */
export function parseCSVOntology(content: string, type: "entities" | "relationships"): ParseResult {
  try {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      return {
        success: false,
        error: "CSV file must have at least a header row and one data row"
      };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    if (type === "entities") {
      // More flexible header detection for entities
      const typeHeader = headers.find(h => h === 'type' || h === 'entity' || h === 'name' || h === 'entity_type');
      if (!typeHeader) {
        return {
          success: false,
          error: `Missing required header for entity type. Found headers: ${headers.join(', ')}. Expected: 'type', 'entity', or 'name'`
        };
      }

      const entities: ParsedEntity[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Handle CSV with quoted values that may contain commas
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim()); // Add last value
        
        if (values.length < headers.length) continue;

        const entity: any = {};
        headers.forEach((header, index) => {
          // Remove quotes from values
          let value = values[index] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          entity[header] = value;
        });

        // Get entity type from whichever header exists
        const entityType = entity.type || entity.entity || entity.name || entity.entity_type;
        if (!entityType) continue;

        // Parse attributes
        let attributes: string[] = [];
        if (entity.attributes) {
          attributes = entity.attributes.split(/[;,]/).map((a: string) => a.trim()).filter(Boolean);
        }

        entities.push({
          id: entity.id || `E${Date.now()}-${i}`,
          type: entityType,
          description: entity.description || "",
          attributes
        });
      }

      return {
        success: true,
        data: {
          entities,
          relationships: []
        }
      };
    } else {
      // Relationships - more flexible header detection
      const fromHeader = headers.find(h => h === 'from' || h === 'source' || h === 'from_entity');
      const toHeader = headers.find(h => h === 'to' || h === 'target' || h === 'to_entity');
      const relHeader = headers.find(h => h === 'relationship' || h === 'rel' || h === 'relation' || h === 'type');
      
      if (!fromHeader || !toHeader) {
        return {
          success: false,
          error: `Missing required headers for relationships. Found headers: ${headers.join(', ')}. Expected: 'from'/'source' and 'to'/'target'`
        };
      }

      const relationships: ParsedRelationship[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Handle CSV with quoted values that may contain commas
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim()); // Add last value
        
        if (values.length < headers.length) continue;

        const rel: any = {};
        headers.forEach((header, index) => {
          // Remove quotes from values
          let value = values[index] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          rel[header] = value;
        });

        // Get values from whichever headers exist
        const from = rel.from || rel.source || rel.from_entity;
        const to = rel.to || rel.target || rel.to_entity;
        const relationship = rel.relationship || rel.rel || rel.relation || rel.type || 'related_to';

        if (!from || !to) continue;

        relationships.push({
          from,
          to,
          relationship,
          description: rel.description || ""
        });
      }

      return {
        success: true,
        data: {
          entities: [],
          relationships
        }
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to parse CSV file"
    };
  }
}

/**
 * Convert a data CSV into ontology entities
 * This handles CSVs that contain actual data (like stores, products, etc.) rather than ontology structure
 */
function convertDataCSVToEntities(content: string, fileName: string): ParseResult {
  try {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      return {
        success: false,
        error: "CSV file must have at least a header row and one data row"
      };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Infer entity type from filename or use a default
    const entityType = inferEntityTypeFromFileName(fileName, headers);
    
    // Get name/description column if available
    const nameHeader = headers.find(h => 
      h.includes('name') && !h.includes('id')
    ) || headers.find(h => 
      h.includes('title') || h.includes('description')
    );

    // Collect all non-ID columns as potential attributes
    const attributeHeaders = headers.filter(h => {
      const lower = h.toLowerCase();
      return !lower.includes('_id') && 
             !lower.includes('id') && 
             h !== nameHeader;
    });

    const entities: ParsedEntity[] = [];

    // Create a single entity type representing this data structure
    const description = nameHeader 
      ? `Entity type for ${entityType} data. Contains ${lines.length - 1} records. Key field: ${nameHeader}`
      : `Entity type for ${entityType} data. Contains ${lines.length - 1} records.`;
    
    entities.push({
      id: `E${Date.now()}`,
      type: entityType,
      description,
      attributes: attributeHeaders.length > 0 ? attributeHeaders : headers.slice(0, 5) // Use first 5 columns if no clear attributes
    });

    // If there's a grouping/category column (like 'region', 'category', 'format'), create additional entity types
    const groupingHeaders = headers.filter(h => {
      const lower = h.toLowerCase();
      return (lower.includes('region') || 
              lower.includes('category') || 
              lower.includes('type') ||
              lower.includes('format') ||
              lower.includes('group') ||
              lower === 'store_format' ||
              lower === 'country' ||
              lower === 'city') && !lower.includes('_id');
    });

    if (groupingHeaders.length > 0) {
      const groupingHeader = groupingHeaders[0];
      const groupingIndex = headers.indexOf(groupingHeader);
      const uniqueGroups = new Set<string>();

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values[groupingIndex] && values[groupingIndex].trim()) {
          uniqueGroups.add(values[groupingIndex].trim());
        }
      }

      // Create entity types for unique groups (limit to 10 to avoid too many entities)
      Array.from(uniqueGroups).slice(0, 10).forEach(group => {
        const groupType = group.charAt(0).toUpperCase() + group.slice(1);
        entities.push({
          id: `E${Date.now()}-${group}`,
          type: groupType,
          description: `${groupingHeader}: ${group}`,
          attributes: []
        });
      });
    }

    return {
      success: true,
      data: {
        entities,
        relationships: []
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to convert CSV data to ontology format"
    };
  }
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  // Remove quotes from values
  return values.map(v => {
    if (v.startsWith('"') && v.endsWith('"')) {
      return v.slice(1, -1);
    }
    return v;
  });
}

/**
 * Infer entity type from filename or headers
 */
function inferEntityTypeFromFileName(fileName: string, headers: string[]): string {
  const name = fileName.toLowerCase();
  
  // Try to infer from filename
  if (name.includes('store')) return 'Stores';
  if (name.includes('product')) return 'Products';
  if (name.includes('customer')) return 'Customers';
  if (name.includes('market')) return 'Markets';
  if (name.includes('material')) return 'Materials';
  if (name.includes('competitor')) return 'Competitors';
  
  // Try to infer from headers
  if (headers.includes('store_name') || headers.includes('store_id')) return 'Stores';
  if (headers.includes('product_name') || headers.includes('product_id')) return 'Products';
  if (headers.includes('customer_name') || headers.includes('customer_id')) return 'Customers';
  
  // Default: capitalize first word or use filename
  const baseName = fileName.replace('.csv', '').replace(/[_-]/g, ' ');
  return baseName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Parse file based on its type
 */
export async function parseOntologyFile(file: File): Promise<ParseResult> {
  const content = await file.text();
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.json')) {
    return parseJSONOntology(content);
  } else if (fileName.endsWith('.csv')) {
    // Try to detect if it's entities or relationships by checking headers
    const firstLine = content.split('\n')[0].toLowerCase();
    const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
    
    // Check for entity format - more flexible detection
    const hasEntityHeaders = headers.includes('type') || 
                            (headers.includes('entity') && headers.includes('description')) ||
                            (headers.includes('name') && headers.includes('description'));
    
    // Check for relationship format - more flexible detection
    const hasRelationshipHeaders = (headers.includes('from') && headers.includes('to')) ||
                                   (headers.includes('source') && headers.includes('target')) ||
                                   (headers.includes('relationship') && (headers.includes('from') || headers.includes('source')));
    
    if (hasEntityHeaders) {
      return parseCSVOntology(content, "entities");
    } else if (hasRelationshipHeaders) {
      return parseCSVOntology(content, "relationships");
    } else {
      // This looks like a data CSV, not an ontology structure CSV
      // Convert it to ontology entities
      return convertDataCSVToEntities(content, file.name);
    }
  } else {
    return {
      success: false,
      error: "Unsupported file format. Please upload a JSON or CSV file."
    };
  }
}


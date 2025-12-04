import { ParsedEntity, ParsedRelationship, ParsedOntology } from "./ontologyParser";

export interface OntologyNode {
  id: string;
  name: string;
  type: string;
  description: string;
  attributes: string[];
}

export interface OntologyRelationship {
  from: string;
  to: string;
  relationship: string;
  description: string;
}

export interface MergeResult {
  nodes: OntologyNode[];
  relationships: OntologyRelationship[];
  stats: {
    entitiesAdded: number;
    entitiesUpdated: number;
    relationshipsAdded: number;
    relationshipsUpdated: number;
  };
}

/**
 * Generate a unique ID for a new entity
 */
function generateEntityId(existingIds: string[]): string {
  let counter = 1;
  let newId = `E${counter}`;
  while (existingIds.includes(newId)) {
    counter++;
    newId = `E${counter}`;
  }
  return newId;
}

/**
 * Merge imported ontology with existing ontology
 */
export function mergeOntology(
  existingNodes: OntologyNode[],
  existingRelationships: OntologyRelationship[],
  importedData: ParsedOntology
): MergeResult {
  const stats = {
    entitiesAdded: 0,
    entitiesUpdated: 0,
    relationshipsAdded: 0,
    relationshipsUpdated: 0
  };

  // Create a map of existing entities by type for quick lookup
  const existingEntitiesByType = new Map<string, OntologyNode>();
  existingNodes.forEach(node => {
    existingEntitiesByType.set(node.type, node);
  });

  // Create a set of existing entity IDs
  const existingIds = new Set(existingNodes.map(n => n.id));

  // Merge entities
  const mergedNodes: OntologyNode[] = [...existingNodes];
  const processedTypes = new Set<string>();

  importedData.entities.forEach(importedEntity => {
    const existingEntity = existingEntitiesByType.get(importedEntity.type);
    
    if (existingEntity) {
      // Update existing entity
      const index = mergedNodes.findIndex(n => n.id === existingEntity.id);
      if (index !== -1) {
        mergedNodes[index] = {
          ...mergedNodes[index],
          description: importedEntity.description || mergedNodes[index].description,
          // Merge attributes (combine unique attributes)
          attributes: [
            ...new Set([...mergedNodes[index].attributes, ...importedEntity.attributes])
          ]
        };
        stats.entitiesUpdated++;
      }
      processedTypes.add(importedEntity.type);
    } else {
      // Add new entity
      const newId = importedEntity.id && !existingIds.has(importedEntity.id)
        ? importedEntity.id
        : generateEntityId(Array.from(existingIds));
      
      existingIds.add(newId);
      
      mergedNodes.push({
        id: newId,
        name: importedEntity.type,
        type: importedEntity.type,
        description: importedEntity.description,
        attributes: importedEntity.attributes || []
      });
      stats.entitiesAdded++;
      processedTypes.add(importedEntity.type);
    }
  });

  // Create a map of existing relationships for duplicate detection
  const existingRelationshipsMap = new Map<string, OntologyRelationship>();
  existingRelationships.forEach(rel => {
    const key = `${rel.from}-${rel.relationship}-${rel.to}`;
    existingRelationshipsMap.set(key, rel);
  });

  // Merge relationships
  const mergedRelationships: OntologyRelationship[] = [...existingRelationships];

  importedData.relationships.forEach(importedRel => {
    const key = `${importedRel.from}-${importedRel.relationship}-${importedRel.to}`;
    const existingRel = existingRelationshipsMap.get(key);

    if (existingRel) {
      // Update existing relationship
      const index = mergedRelationships.findIndex(
        r => r.from === existingRel.from &&
             r.relationship === existingRel.relationship &&
             r.to === existingRel.to
      );
      if (index !== -1) {
        mergedRelationships[index] = {
          ...mergedRelationships[index],
          description: importedRel.description || mergedRelationships[index].description
        };
        stats.relationshipsUpdated++;
      }
    } else {
      // Add new relationship (only if both entities exist)
      const fromExists = mergedNodes.some(n => n.type === importedRel.from);
      const toExists = mergedNodes.some(n => n.type === importedRel.to);

      if (fromExists && toExists) {
        mergedRelationships.push({
          from: importedRel.from,
          to: importedRel.to,
          relationship: importedRel.relationship,
          description: importedRel.description
        });
        stats.relationshipsAdded++;
      }
    }
  });

  return {
    nodes: mergedNodes,
    relationships: mergedRelationships,
    stats
  };
}


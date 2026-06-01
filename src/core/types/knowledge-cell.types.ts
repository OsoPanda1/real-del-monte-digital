/**
 * Knowledge Cell Types - Specialized Microservice Containers
 * Each cell is a self-contained, versioned, deployable unit
 */

export type CellType = 
  | 'Render3D' 
  | 'Render4D' 
  | 'IA-ImmersiveFX' 
  | 'QuantumChannel' 
  | 'SensorMultiFX' 
  | 'APIIntegration' 
  | 'Analytics' 
  | 'UIControl' 
  | 'SpatialLogic';

export interface KnowledgeCell {
  id: string;
  type: CellType;
  description: string;
  version: string;
  dependencies?: string[];
  inputFormat: string;
  outputFormat: string;
  iaSpecializationPrompt: string;
  apiEndpoint: string;
  microserviceUrl: string;
  testCases: string[];
  visualizationSample?: string;
  author: string;
  created: Date;
  updated: Date;
  tags: string[];
  isPublic: boolean;
}

export interface KnowledgeRepository {
  cells: Record<string, KnowledgeCell>;
  relations: Array<{
    from: string;
    to: string;
    relation: 'requires' | 'extends' | 'composes' | 'consumes';
  }>;
  aiExpertiseProfile: string;
  version: string;
  metadata: Record<string, unknown>;
}

export interface CellExecutionContext {
  cellId: string;
  input: unknown;
  timeout?: number;
  retries?: number;
}

export interface CellExecutionResult<T = unknown> {
  cellId: string;
  success: boolean;
  output?: T;
  error?: string;
  executionTime: number;
  retryCount: number;
}

/**
 * TAMV Federation Core Types - L0-L7
 * Architectural Foundation for Territorial & Multidimensional Awareness
 */

// ============================================================================
// L0: DOCTRINE & ETHICS
// ============================================================================

export enum EthicRiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface EthicRule {
  id: string;
  name: string;
  description: string;
  severity: EthicRiskLevel;
  validator: (command: ProtocolCommand) => boolean;
}

export interface EthicDecision {
  approved: boolean;
  risk: EthicRiskLevel;
  reasons: string[];
  violations: string[];
}

// ============================================================================
// L1: MEMORY & REGISTRY (MSR + BookPi)
// ============================================================================

export interface RegistryEvent {
  id: string;
  commandId: string;
  actorId: string;
  timestamp: Date;
  risk: EthicRiskLevel;
  status: 'accepted' | 'rejected' | 'pending';
  metadata: Record<string, unknown>;
}

export interface NarrativeEntry {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  createdAt: Date;
  references: string[];
}

// ============================================================================
// L2: PROTOCOLS & CONTROL
// ============================================================================

export interface ProtocolCommand {
  id: string;
  name: string;
  actorId: string;
  payload: Record<string, unknown>;
  timestamp: Date;
  priority?: number;
}

export interface ProtocolDecision {
  approved: boolean;
  risk: EthicRiskLevel;
  reasons: string[];
}

export interface ProtocolExecutionResult {
  commandId: string;
  decision: ProtocolDecision;
  lifecycle: 'accepted' | 'rejected';
  msrEventId: string;
  bookpiEntryId: string;
  executedAt: Date;
}

// ============================================================================
// L3: GUARDIANSHIP & OBSERVABILITY
// ============================================================================

export interface HealthMetric {
  service: string;
  status: 'healthy' | 'degraded' | 'critical';
  latency_ms: number;
  error_rate: number;
  last_check: Date;
}

export interface AlertThreshold {
  metric: string;
  warning: number;
  critical: number;
}

export interface GuardianAlert {
  id: string;
  severity: EthicRiskLevel;
  service: string;
  message: string;
  details: Record<string, unknown>;
  createdAt: Date;
}

// ============================================================================
// L4: XR/VISUAL & SPATIAL
// ============================================================================

export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface SpatialCell {
  hash: string;
  points: GeoPoint[];
  metadata?: Record<string, unknown>;
}

export interface ContextualDecision {
  priority: number;
  action: string;
  payload: unknown;
  reason: string;
}

// ============================================================================
// L5: DOMAIN SERVICES
// ============================================================================

export interface DomainService {
  name: string;
  version: string;
  status: 'ready' | 'initializing' | 'error';
  capabilities: string[];
}

export interface IdentityRecord {
  id: string;
  email: string;
  publicKey: string;
  createdAt: Date;
  verifiedAt?: Date;
}

export interface CommerceEntity {
  id: string;
  name: string;
  category: string;
  location: GeoPoint;
  verified: boolean;
}

export interface TelemetryData {
  timestamp: Date;
  userId: string;
  location: GeoPoint;
  signal?: Record<string, number>;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// L6: UX SHELL
// ============================================================================

export interface UIState {
  isLoading: boolean;
  error?: string;
  data?: unknown;
}

// ============================================================================
// L7: QUANTUM-INSPIRED
// ============================================================================

export type FeedbackStrategy = 'penalize_strategy' | 'reinforce_strategy' | 'neutral';

export interface QuantumDecisionState {
  superposition: ContextualDecision[];
  collapsed?: ContextualDecision;
  probability: number;
}

// ============================================================================
// FEDERATION COORDINATOR
// ============================================================================

export interface TamvExecutionContext {
  commandId: string;
  actorId: string;
  location?: GeoPoint;
  speed?: number;
  timestamp: Date;
  traceId?: string;
}

export interface TamvExecutionResult {
  executionId: string;
  success: boolean;
  protocolDecision?: ProtocolDecision;
  contextualDecisions?: ContextualDecision[];
  feedbackStrategy?: FeedbackStrategy;
  timestamp: Date;
  reason?: string;
  details?: Record<string, unknown>;
  error?: string;
}

export interface TamvCoordinatorConfig {
  enableObservability: boolean;
  enableFeedback: boolean;
  enableCaching: boolean;
  spatialGridResolution: number;
  maxExecutionTime: number;
  env: 'development' | 'staging' | 'production';
}

// ============================================================================
// EVENT SYSTEM
// ============================================================================

export type EventHandler<T = unknown> = (data: T) => void | Promise<void>;

export interface EventBusConfig {
  maxListeners: number;
  logEvents: boolean;
}

export interface PublishedEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: Date;
  traceId: string;
}

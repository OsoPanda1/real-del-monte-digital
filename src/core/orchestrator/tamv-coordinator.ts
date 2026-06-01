/**
 * TAMV Coordinator - Central Federation Orchestrator
 * Unifies L0-L7: Ethics → Events → Decisions → Spatial → AI
 * Production-ready coordination hub
 */

import {
  TamvExecutionContext,
  TamvExecutionResult,
  TamvCoordinatorConfig,
} from '@/core/types/federation.types';
import { protocolEngine } from '@/lib/tamv/protocol.engine';
import { eventFabric } from '@/core/event/event-fabric';
import { gen8Engine } from './gen8.engine';
import { spatialIndex } from '@/core/geo/spatial-index';
import { feedbackLoop, FeedbackMetrics } from '@/core/ai/feedback-loop';
import { createLogger } from '@/core/logger/logger';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('TamvCoordinator');

export interface ExecutionMetrics {
  executionId: string;
  totalTime: number;
  protocolTime: number;
  spatialTime: number;
  contextualTime: number;
  feedbackTime: number;
}

export class TamvCoordinator {
  private config: TamvCoordinatorConfig;
  private executionLog: Map<string, TamvExecutionResult> = new Map();
  private metrics: ExecutionMetrics[] = [];
  private maxLogSize: number = 1000;

  constructor(config: TamvCoordinatorConfig) {
    this.config = config;
    logger.info('TAMV Coordinator initialized', {
      env: config.env,
      observability: config.enableObservability,
      feedback: config.enableFeedback,
    });
  }

  /**
   * MAIN ENTRY POINT: Execute federated command
   */
  async executeCommand(
    command: any,
    context: TamvExecutionContext
  ): Promise<TamvExecutionResult> {
    const executionId = `exec_${context.commandId}_${uuidv4().slice(0, 8)}`;
    const startTime = Date.now();

    try {
      // 1. PROTOCOL EXECUTION (L0-L2)
      const protocolStartTime = Date.now();
      const protocolResult = this.protocolEngine.execute(command);
      const protocolTime = Date.now() - protocolStartTime;

      if (!protocolResult.decision.approved) {
        return this.createResult(executionId, false, protocolResult, startTime);
      }

      // Emit protocol approved event
      await eventFabric.emit('protocol:approved', {
        executionId,
        commandId: context.commandId,
        decision: protocolResult.decision,
      });

      // 2. SPATIAL INDEXING (L4)
      const spatialStartTime = Date.now();
      if (context.location) {
        spatialIndex.insert(context.location);
      }
      const spatialTime = Date.now() - spatialStartTime;

      // 3. CONTEXTUAL DECISIONS (L4 - Gen8)
      const contextualStartTime = Date.now();
      const decisions = gen8Engine.evaluate({
        speed: context.speed,
        poiNearby: context.location,
        timestamp: context.timestamp,
        userId: context.actorId,
      });
      const contextualTime = Date.now() - contextualStartTime;

      // 4. AI FEEDBACK & ADAPTATION (L7)
      const feedbackStartTime = Date.now();
      const feedbackMetrics: FeedbackMetrics = {
        score: protocolResult.decision.approved ? 9 : 2,
        outcome: protocolResult.decision.approved ? 'success' : 'failure',
        impactScore: decisions.length,
        timestamp: context.timestamp,
        metadata: { executionId },
      };
      const feedbackStrategy = this.feedbackLoop.adjustModel(feedbackMetrics);
      const feedbackTime = Date.now() - feedbackStartTime;

      // 5. BUILD EXECUTION RESULT
      const result: TamvExecutionResult = {
        executionId,
        success: true,
        protocolDecision: protocolResult.decision,
        contextualDecisions: decisions,
        feedbackStrategy,
        timestamp: new Date(),
        details: {
          msrEventId: protocolResult.msrEventId,
          bookpiEntryId: protocolResult.bookpiEntryId,
          spatialCells: spatialIndex.getStats(),
        },
      };

      // 6. LOG & EMIT
      this.recordExecution(result);
      this.recordMetrics(executionId, {
        executionId,
        totalTime: Date.now() - startTime,
        protocolTime,
        spatialTime,
        contextualTime,
        feedbackTime,
      });

      await eventFabric.emit('execution:completed', {
        ...result,
        metrics: this.metrics[this.metrics.length - 1],
      });

      logger.info(`✓ Command executed successfully: ${executionId}`, {
        duration: Date.now() - startTime,
        decisions: decisions.length,
      });

      return result;
    } catch (error) {
      logger.error(`✗ Command execution failed: ${executionId}`, error as Error);
      return this.createErrorResult(executionId, error as Error, startTime);
    }
  }

  /**
   * Get execution result from log
   */
  getExecution(executionId: string): TamvExecutionResult | undefined {
    return this.executionLog.get(executionId);
  }

  /**
   * Get coordinator observability metrics
   */
  getMetrics() {
    const stats = {
      totalExecutions: this.executionLog.size,
      recentMetrics: this.metrics.slice(-10),
      spatialCells: spatialIndex.getStats(),
      feedbackStats: feedbackLoop.getStats(),
      eventBusStats: require('@/core/event/event-bus').eventBus.getStats(),
    };

    return stats;
  }

  /**
   * Health check
   */
  async health(): Promise<{
    status: 'healthy' | 'degraded' | 'critical';
    components: Record<string, 'ok' | 'error'>;
  }> {
    const components: Record<string, 'ok' | 'error'> = {
      eventFabric: (await eventFabric.health()) ? 'ok' : 'error',
      spatialIndex: 'ok',
      feedback: 'ok',
    };

    const status =
      Object.values(components).some(s => s === 'error')
        ? 'degraded'
        : 'healthy';

    return { status, components };
  }

  /**
   * Reset execution log (for testing/maintenance)
   */
  reset(): void {
    this.executionLog.clear();
    this.metrics = [];
    logger.warn('TAMV Coordinator state reset');
  }

  // ========== Private Helpers ==========

  private protocolEngine = protocolEngine;
  private feedbackLoop = feedbackLoop;

  private recordExecution(result: TamvExecutionResult): void {
    this.executionLog.set(result.executionId, result);

    if (this.executionLog.size > this.maxLogSize) {
      const firstKey = this.executionLog.keys().next().value;
      this.executionLog.delete(firstKey);
    }
  }

  private recordMetrics(executionId: string, metrics: ExecutionMetrics): void {
    this.metrics.push(metrics);

    if (this.metrics.length > this.maxLogSize / 2) {
      this.metrics = this.metrics.slice(-Math.floor(this.maxLogSize / 2));
    }
  }

  private createResult(
    executionId: string,
    success: boolean,
    details: any,
    startTime: number
  ): TamvExecutionResult {
    return {
      executionId,
      success,
      timestamp: new Date(),
      details,
    };
  }

  private createErrorResult(
    executionId: string,
    error: Error,
    startTime: number
  ): TamvExecutionResult {
    return {
      executionId,
      success: false,
      error: error.message,
      timestamp: new Date(),
      reason: 'execution_error',
    };
  }
}

// Singleton coordinator
let coordinator: TamvCoordinator | null = null;

export function getTamvCoordinator(config?: TamvCoordinatorConfig): TamvCoordinator {
  if (!coordinator) {
    const defaultConfig: TamvCoordinatorConfig = {
      enableObservability: true,
      enableFeedback: true,
      enableCaching: true,
      spatialGridResolution: 100,
      maxExecutionTime: 5000,
      env: (process.env.NODE_ENV as any) || 'development',
    };

    coordinator = new TamvCoordinator(config || defaultConfig);
  }

  return coordinator;
}

export const tamvCoordinator = getTamvCoordinator();

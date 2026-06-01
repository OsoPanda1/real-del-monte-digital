/**
 * BookPi Service - Narrative Registry & Documentation
 * L1: Immutable record of all significant protocol decisions
 */

import { NarrativeEntry } from '@/core/types/federation.types';
import { createLogger } from '@/core/logger/logger';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('BookPiService');

export interface BookPiEntryInput {
  title: string;
  summary: string;
  tags: string[];
  references?: string[];
}

export class BookPiService {
  private entries: NarrativeEntry[] = [];
  private maxEntries: number = 5000;

  /**
   * Publish narrative entry
   */
  publishEntry(input: BookPiEntryInput): NarrativeEntry {
    const entry: NarrativeEntry = {
      id: `bookpi_${uuidv4().slice(0, 12)}`,
      title: input.title,
      summary: input.summary,
      tags: input.tags,
      createdAt: new Date(),
      references: input.references || [],
    };

    this.entries.push(entry);

    // Trim old entries if exceeding max
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    logger.info(`Narrative entry published: ${entry.id}`, {
      title: input.title,
      tags: input.tags,
    });

    return entry;
  }

  /**
   * Get entry by ID
   */
  getEntry(id: string): NarrativeEntry | undefined {
    return this.entries.find(e => e.id === id);
  }

  /**
   * Search entries by tag
   */
  searchByTag(tag: string, limit: number = 50): NarrativeEntry[] {
    return this.entries
      .filter(e => e.tags.includes(tag))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Search entries by title/summary
   */
  search(query: string, limit: number = 50): NarrativeEntry[] {
    const queryLower = query.toLowerCase();
    return this.entries
      .filter(
        e =>
          e.title.toLowerCase().includes(queryLower) ||
          e.summary.toLowerCase().includes(queryLower)
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get recent entries
   */
  getRecent(limit: number = 50): NarrativeEntry[] {
    return this.entries
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get all tags with frequency
   */
  getTagStatistics(): Record<string, number> {
    const stats: Record<string, number> = {};

    for (const entry of this.entries) {
      for (const tag of entry.tags) {
        stats[tag] = (stats[tag] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * Export narrative as markdown
   */
  exportAsMarkdown(tag?: string): string {
    let entries = this.entries;

    if (tag) {
      entries = entries.filter(e => e.tags.includes(tag));
    }

    entries = entries.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    let markdown = '# TAMV Narrative Registry\n\n';
    markdown += `Generated: ${new Date().toISOString()}\n\n`;

    for (const entry of entries) {
      markdown += `## ${entry.title}\n`;
      markdown += `**ID**: \`${entry.id}\`\n`;
      markdown += `**Date**: ${entry.createdAt.toISOString()}\n`;
      markdown += `**Tags**: ${entry.tags.join(', ')}\n\n`;
      markdown += `${entry.summary}\n\n`;

      if (entry.references.length > 0) {
        markdown += `**References**: ${entry.references.join(', ')}\n\n`;
      }

      markdown += '---\n\n';
    }

    return markdown;
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalEntries: number;
    uniqueTags: number;
    oldestEntry?: Date;
    newestEntry?: Date;
  } {
    if (this.entries.length === 0) {
      return {
        totalEntries: 0,
        uniqueTags: 0,
      };
    }

    const tags = new Set<string>();
    this.entries.forEach(e => e.tags.forEach(tag => tags.add(tag)));

    const dates = this.entries.map(e => e.createdAt);
    const oldestEntry = new Date(Math.min(...dates.map(d => d.getTime())));
    const newestEntry = new Date(Math.max(...dates.map(d => d.getTime())));

    return {
      totalEntries: this.entries.length,
      uniqueTags: tags.size,
      oldestEntry,
      newestEntry,
    };
  }

  /**
   * Clear entries (only for testing/maintenance)
   */
  clear(): void {
    const count = this.entries.length;
    this.entries = [];
    logger.warn(`BookPi history cleared: ${count} entries removed`);
  }
}

export const bookpiService = new BookPiService();

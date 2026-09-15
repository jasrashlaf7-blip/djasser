/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ar' | 'fr';

export interface Project {
  id: string;
  title: Record<Language, string>;
  category: Record<Language, string>;
  description: Record<Language, string>;
  problem: Record<Language, string>;
  solution: Record<Language, string>;
  features: Record<Language, string[]>;
  technologies: string[];
  status: 'concept' | 'prototype' | 'experimental' | 'development';
  github?: string;
  demoUrl?: string;
}

export interface Prototype {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  technologies: string[];
}

export interface Experience {
  id: string;
  title: Record<Language, string>;
  company: Record<Language, string>;
  period: Record<Language, string>;
  responsibilities: Record<Language, string[]>;
}

export interface Education {
  id: string;
  school: Record<Language, string>;
  degree: Record<Language, string>;
  period: Record<Language, string>;
  details?: Record<Language, string>;
}

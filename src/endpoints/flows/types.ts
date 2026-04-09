import type {
  Identifiable,
  Relationship,
  Resource,
  ResourceList,
  ResourcePage,
} from '../../types/core';
import type { Field } from '../fields';

export interface FlowBase {
  type: 'flow';
  slug: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Flow extends Identifiable, FlowBase {
  relationships?: {
    fields: Relationship<string>;
  };
  links?: {
    [key: string]: string;
  };
  meta?: {
    timestamps?: {
      created_at: string;
      updated_at: string;
    };
    owner?: 'organization' | 'store';
  };
}

export type FlowResource = Resource<Flow>;
export type FlowPage = ResourcePage<Flow>;
export type CreateFlowBody = Omit<FlowBase, 'type'>;
export type UpdateFlowBody = Partial<Omit<FlowBase, 'type'>>;

export interface FlowEntryBase {
  type: 'entry';
  [key: string]: unknown;
}

export interface FlowEntry extends Identifiable, FlowEntryBase {
  links?: {
    [key: string]: string;
  };
  meta?: {
    timestamps?: {
      created_at: string;
      updated_at: string;
    };
    owner?: 'organization' | 'store';
  };
}

export type FlowEntryResource<TEntry = FlowEntry> = Resource<TEntry>;
export type FlowEntryPage<TEntry = FlowEntry> = ResourcePage<TEntry>;
export type FlowFieldList = ResourceList<Field>;
export type FlowAttributesResponse = ResourceList<unknown>;

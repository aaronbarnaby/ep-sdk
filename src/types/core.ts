export type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object ? Subset<K[attr]> : K[attr];
};

export interface Identifiable {
  id: string;
}

export interface Resource<R> {
  data: R;
}

export interface ResourceList<R> {
  data: R[];
}

export interface ResourceIncluded<R, I = never> extends Resource<R> {
  included?: I;
}

export interface Attribute {
  label: string;
  value: string;
  type: string;
  required: boolean;
  options?: string[];
  description?: string;
  validation_rules?: Validation[];
  validation?: {
    regex: string;
  };
}

export interface Validation {
  type: string;
  to?: string;
  options?: unknown;
}

export interface AttributesMeta {
  entity: string;
  version: string;
}

export interface Attributes extends ResourceList<Attribute> {
  meta: AttributesMeta;
}

export interface ResourcePage<R, I = never> extends ResourceList<R> {
  links: { [key: string]: string | null };
  meta: {
    page: {
      current: number;
      limit: number;
      offset: number;
      total: number;
    };
    results: {
      total: number;
      total_method?: 'observed' | 'exact';
    };
  };
  included?: I;
}

export interface Relationship<T> {
  data: {
    id: string;
    type: T;
  };
}

export interface RelationshipToMany<T> {
  data: {
    id: string;
    type: T;
  }[];
}

export interface RelationshipToOne<T> {
  data: {
    id: string;
    type: T;
  };
}

export interface TimestampFilters {
  gt?: {
    created_at?: string;
    updated_at?: string;
  };
  ge?: {
    created_at?: string;
    updated_at?: string;
  };
  lt?: {
    created_at?: string;
    updated_at?: string;
  };
  le?: {
    created_at?: string;
    updated_at?: string;
  };
}

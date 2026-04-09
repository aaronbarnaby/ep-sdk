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

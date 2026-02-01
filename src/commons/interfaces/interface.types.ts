export interface ListOptions {
  filter?: Record<string, any>;
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}

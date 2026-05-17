import type { Owner } from './Owner';
import type { Label } from './Label';

export interface Issue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  author: Owner;
  labels: Label[];
  createdAt: Date;
  htmlUrl: string;
}

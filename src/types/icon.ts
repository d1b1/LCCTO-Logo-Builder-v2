export interface IconStyle {
  family: string;
  style: string;
}

export interface IconMembership {
  free: IconStyle[];
  pro: IconStyle[];
}

export interface IconData {
  objectID: string;
  label: string;
  name: string;
  type: string;
  unicode: string;
  styles: string[];
  membership: {
    free: Array<{ family: string; style: string }>;
    pro: Array<{ family: string; style: string }>;
  };
  family: string;
  keywords: string[];
  categories: string[];
  style: string;
  is_free: boolean;
}
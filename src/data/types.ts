export type SourceLink = { label: string; href: string };
export type Block = {
  type: string;
  text?: string;
  src?: string;
  original?: string;
  alt?: string;
  width?: number;
  height?: number;
  items?: string[];
  links?: SourceLink[];
};
export type Section = { heading: string; blocks: Block[] };
export type SourcePage = {
  route: string;
  source: string;
  title: string;
  description: string;
  heading: string;
  blocks: Block[];
  sections: Section[];
  links: SourceLink[];
};

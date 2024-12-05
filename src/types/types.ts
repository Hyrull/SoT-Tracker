export interface Emblem {
  Image: string;
  DisplayName: string;
  Description: string;
  Completed?: boolean;
  Grade: number;
  MaxGrade: number;
  subtitle?: string;
  title?: string;
  image?: string;
  Value: number;
  Threshold: number;
}

export interface EmblemCardProps {
  emblem: Emblem;
}

export interface Campaign {
  Title:string;
  Desc: string;
  Emblems?: Emblem[]
}

export interface FactionData {
  Motto: string;
  Intro: string;
  Emblems?: { Emblems: Emblem[] };
  Campaigns?: Record<string, Campaign>
}

export interface AllCommsData {
  [key: string]: FactionData;
}

export interface DropdownProps {
  title: string | JSX.Element
  content: string  | JSX.Element
}


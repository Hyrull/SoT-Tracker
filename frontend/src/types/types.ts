export interface Emblem {
  Image: string;
  DisplayName: string;
  Description: string;
  Completed: boolean;
  Grade: number;
  MaxGrade: number;
  image: string;
  title: string;
  subtitle: string;
}

export interface FactionData {
  Motto: string;
  Intro: string;
  Rank: string;
  Level: number;
  DistinctionLevel: number;
  PromotionsUnlocked: number;
  PromotionsTotal: number;
  Emblems: {
    EmblemsTotal: number;
    EmblemsUnlocked: number;
    Emblems: Emblem[];
  };
}

export interface AllCommsData {
  [key: string]: FactionData;
}



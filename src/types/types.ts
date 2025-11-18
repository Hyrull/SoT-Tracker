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
  rewardType?: string;
  reward?: string;
  reward_graded?: { grade: number; reward: string }[];
}

export interface EmblemCardProps {
  emblem: Emblem;
  showRewards: boolean;
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
  title: React.ReactNode | ((props: { displayContent: boolean }) => React.ReactNode);
  content: React.ReactNode | string;
}

export interface FiltersBarProps {
  hideCompleted: boolean
  toggleHideCompleted: () => void
  showRewards: boolean
  toggleShowRewards: () => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  refreshData: () => void
  refreshing: boolean
  isSticky?: boolean
  isDemo: boolean
}

export interface FactionDropdownProps {
  factionKey: string;
  factionData: FactionData;
  hideCompleted: boolean;
  showRewards: boolean;
  searchQuery: string;
}

export interface PinnedItem {
  faction: string
  emblem: string
  campaign?: string
}
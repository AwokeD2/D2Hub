export interface CommunityMacro {
  id: string;
  name: string;
  filename: string;
  category: "Movement" | "Combat" | "Farming" | "Utility";
  classTarget: "Warlock" | "Hunter" | "Titan" | "All Classes";
  author: string;
  version: string;
  downloads?: string;
  rating?: number;
  description: string;
  instructions: string[];
  keybinds: { action: string; key: string }[];
  code: string;
  isVerified?: boolean;
  verifiedBy?: string;
  isTrusted?: boolean;
  isCustom?: boolean;
  createdAt?: string;
}

// Default community list (empty so Awoke and community can add their own verified macros)
export const COMMUNITY_MACROS: CommunityMacro[] = [];

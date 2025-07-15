// NFT related types

export interface NFTContextType {
  fetchNFTs: (filters: NFTFilters) => Promise<NFT[]>;
  fetchTokens: (filters: TokenFilters) => Promise<any[]>; // Add this

}



export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: number;
  currency: string;
  creator: {

    name: string;
    username: string;
    avatar: string;
  };
  owner?: {
    name: string;
    username: string;
    avatar: string;
  };
  collection: string;
  category: string; // This should be just a string
  status?: string;
  likes: number;
  createdAt: string;
  tokenId: string;
  blockchain: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  tier?: string;
  endsIn?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTHistoryItem {
  id: string;
  type: 'Mint' | 'List' | 'Sale' | 'Transfer' | 'Bid';
  from: string;
  to: string;
  price?: string;
  currency?: string;
  timestamp: string;
  txHash?: string;
}

export interface NFTCollection {
  name: string;
  image: string;
  itemCount: number;
  floorPrice: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
  };
}

export interface NFTCategory {
  name: string;
  image?: string;
  itemCount?: number;
  description?: string;
}

// AMMYI Tier types
export type AmmyiTierName = "all" | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface AmmyiTier {
  name: AmmyiTierName;
  price: number;
  purpose: string;
  visualContent: string;
  color: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  icon: string;
}

// User related types
export interface User {
  address: string;
  username: string;
  avatar: string;
  bio?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  isVerified: boolean;
}

// Filter types
export interface NFTFilters {
  category?: string;
  collection?: string;
  tier?: AmmyiTierName;
  minPrice?: number;
  maxPrice?: number;
  creator?: string;
  status?: string;
  search?: string;
  type?: string;
}

export interface TokenFilters {
  search?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Mint related types
export interface MintFormData {
  name: string;
  description: string;
  image: File | null;
  imagePreview: string | null;
  price: string;
  currency: string;
  collection: string;
  category: string;
  tier?: AmmyiTierName;
  royalty: string;
}

// types.ts
export interface TiercatData {
  id: string;
  name: string;
  description: string;
  image: string;
  tier: string;
  category: string;
  price: number; // or string if you're using string prices
  currency: string;
  likes: number;
  createdAt: string;
  collection: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  attributes: {
    trait_type: string;
    value: string;
  }[];
  // Add any optional fields that might be required
  status?: string;
  owner?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  // tokenId: string;
  // blockchain: string;
}
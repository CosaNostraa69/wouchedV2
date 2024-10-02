// Dans un fichier types/profile.ts ou directement dans les fichiers des composants

export interface Company {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    location: string | null;
    size: string | null;
    logo: string | null;
    foundedYear: number | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserProfile {
    id: string;
    userId: string;
    bio: string | null;
    experience: string | null;
    skills: string[];
    steamProfile: string | null;
    twitchProfile: string | null;
    discordProfile: string | null;
  }
  
  export interface PublicEmployerProfileProps {
    employerId: string;
    company: Company;
  }
  
  export interface PublicUserProfileProps {
    userId: string;
    profile: UserProfile;
  }
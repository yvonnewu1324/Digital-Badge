export interface CardData {
  name: string;
  roles: string[];
  tags?: string[];
  bio: string;
  email: string;
  website: string;
  phone: string;
  linkedin?: string;
  avatarUrl?: string;
}

export interface CardStyle {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}
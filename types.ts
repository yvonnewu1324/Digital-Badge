export interface CardData {
  name: string;
  role: string;
  bio: string;
  email: string;
  website: string;
  phone: string;
  avatarUrl?: string;
}

export interface CardStyle {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}
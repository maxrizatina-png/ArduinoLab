export type Difficulty = 'Easy' | 'Medium' | 'Advanced';

export interface Project {
  id: string;
  title: string;
  image: string;
  difficulty: Difficulty;
  description: string;
  instructions: string;
  wiringDiagram?: string;
  arduinoCode: string;
  classCode?: string;
  youtubeVideoId?: string;
  youtubeAuthor?: string;
}

export interface UserSubmission {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  instructions: string;
  arduinoCode: string;
  classCode?: string;
  imageUri?: string;
  wiringDiagramUri?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ProjectDetail: { projectId: string };
  Settings: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  FavoritesTab: undefined;
};

export interface LessonSection {
  id: string;
  title: string;
  paragraphs: string[];
  mathFormula?: string;
  bulletPoints?: { label?: string; text: string }[];
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface CoachModule {
  id: string;
  moduleNumber: number;
  title: string;
  shortDescription: string;
  iconName: 'sparkles' | 'trending-up' | 'activity' | 'network' | 'target' | 'layers';
  sections: LessonSection[];
}

export interface CoachState {
  completedModules: string[]; // array of module IDs (e.g. ['intro-ml', 'linear-regression'])
}

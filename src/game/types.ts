export type Scene = 'intro' | 'game' | 'game-over' | 'credits';

export type PageLink = {
  url: string;
  context: string;
};

export type Page = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt: string;
  url: string;
  path: string;
  links: PageLink[];
};

export type Stack = Page['url'][];

export type GameState = {
  scene: Scene;
  pages: Record<Page['url'], Page>;
  stacks: Stack[];
  deck: Stack;
  isReadyToPlay: boolean;
  timer: {
    endsAt: number | null;
    timeoutId: ReturnType<typeof setTimeout> | null;
  };
  endState:
    | {
        isGameOver: false;
      }
    | {
        isGameOver: true;
        reason: 'time';
      }
    | {
        isGameOver: true;
        reason: 'incorrect';
        stackIndex: number;
      };
};

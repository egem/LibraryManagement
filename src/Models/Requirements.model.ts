export interface Requirements {
  http: {
    query: {
      minCount: number;
      maxCount: number;
      minPage: number;
    };
  };
  user: {
    name: {
      maxLength: number;
    };
  };
  book: {
    name: {
      maxLength: number;
    };
    score: {
      min: number;
      max: number;
    };
  };
}


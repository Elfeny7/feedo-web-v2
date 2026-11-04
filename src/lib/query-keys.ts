export const queryKeys = {
  auth: {
    currentUser: ["me"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (handle: string) =>
      [...queryKeys.users.all, handle, "detail"] as const,
    posts: (handle: string) =>
      [...queryKeys.users.all, handle, "posts"] as const,
    followList: (handle: string, type: "following" | "followers") =>
      [...queryKeys.users.all, handle, type] as const,
  },
  feed: {
    all: ["feed"] as const,
  },
  search: {
    all: ["search"] as const,
    query: (query: string) => [...queryKeys.search.all, query] as const,
  },
  suggestions: {
    all: ["suggestions"] as const,
  },
};

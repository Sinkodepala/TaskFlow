export const routes = {
  home: "/",
  boards: "/boards",
  board: (id: string) => `/boards/${id}`,
  boardPattern: "boards/:id",
  favorites: "/favorites",
  settings: "/settings",
};
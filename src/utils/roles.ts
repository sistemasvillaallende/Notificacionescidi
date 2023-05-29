const isLoggedIn = localStorage.getItem("isLoggedIn") || false;
const userRole: string = isLoggedIn ? JSON.parse(isLoggedIn).tipo : "";

export const roles = {
  admin: ["admin"],
  user: ["admin", "user"],
  guest: ["admin", "user", "guest"],
};

export const canAccess = (requiredRoles:string[]) => {
  return roles[userRole as keyof typeof roles].some((role:string) => requiredRoles.includes(role));
};
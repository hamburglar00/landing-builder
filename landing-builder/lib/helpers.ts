import type { LandingThemeConfig } from "./types";
import type { Session } from "./mocks";

const SESSION_KEY = "landingbuilder_session";
const CONFIG_KEY_PREFIX = "landingbuilder_config_";

const isBrowser = (): boolean => typeof window !== "undefined";

const getConfigKey = (username: string): string =>
  `${CONFIG_KEY_PREFIX}${username}`;

export const saveSession = (username: string): void => {
  if (!isBrowser()) return;
  const session: Session = { username };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const loadSession = (): Session | null => {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
};

export const clearSession = (): void => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const saveConfig = (
  username: string,
  config: LandingThemeConfig
): void => {
  if (!isBrowser()) return;
  window.localStorage.setItem(getConfigKey(username), JSON.stringify(config));
};

export const loadConfig = (username: string): LandingThemeConfig | null => {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(getConfigKey(username));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LandingThemeConfig;
  } catch {
    return null;
  }
};


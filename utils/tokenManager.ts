import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const CHAMBER_ID_KEY = "chamber_id";
const REMINDER_DATA_KEY = "reminder_data";

export interface UserData {
  user_id: number;
  email: string;
  is_superuser: boolean;
  token: string;
}

export interface ReminderData {
  enabled: boolean;
  timeOfDay: "morning" | "evening";
  hour: number;
  minute: number;
  period: "AM" | "PM";
}

// Simple token storage
export const storeToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

// Simple user data storage
export const storeUserData = async (userData: UserData): Promise<void> => {
  await AsyncStorage.setItem("user_data", JSON.stringify(userData));
};

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const data = await AsyncStorage.getItem("user_data");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const removeUserData = async (): Promise<void> => {
  await AsyncStorage.removeItem("user_data");
};

// Simple auth check
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};

// Chamber ID storage
export const storeChamberId = async (chamberId: number): Promise<void> => {
  await AsyncStorage.setItem(CHAMBER_ID_KEY, chamberId.toString());
};

export const getChamberId = async (): Promise<number | null> => {
  try {
    const data = await AsyncStorage.getItem(CHAMBER_ID_KEY);
    return data ? parseInt(data, 10) : null;
  } catch {
    return null;
  }
};

export const removeChamberId = async (): Promise<void> => {
  await AsyncStorage.removeItem(CHAMBER_ID_KEY);
};

// Simple logout - clears all auth-related data
export const logout = async (): Promise<void> => {
  try {
    // Clear all auth-related data in parallel
    // Using Promise.allSettled to ensure all operations complete even if one fails
    const results = await Promise.allSettled([
      removeToken(),
      removeUserData(),
      removeChamberId(),
      removeReminderData(), // Also clear reminder data on logout
    ]);

    // Verify all data is cleared
    const token = await getToken();
    const userData = await getUserData();
    const chamberId = await getChamberId();

    if (token || userData || chamberId) {
      // Force clear remaining items
      await Promise.allSettled([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem("user_data"),
        AsyncStorage.removeItem(CHAMBER_ID_KEY),
      ]);
    }
  } catch (error) {
    // Even if there's an error, try to clear everything individually
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, "user_data", CHAMBER_ID_KEY, REMINDER_DATA_KEY]);
    } catch (multiRemoveError) {
      throw error; // Re-throw original error
    }
  }
};

// Reminder data storage
export const storeReminderData = async (
  reminderData: ReminderData
): Promise<void> => {
  await AsyncStorage.setItem(REMINDER_DATA_KEY, JSON.stringify(reminderData));
};

export const getReminderData = async (): Promise<ReminderData | null> => {
  try {
    const data = await AsyncStorage.getItem(REMINDER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const removeReminderData = async (): Promise<void> => {
  await AsyncStorage.removeItem(REMINDER_DATA_KEY);
};

// Debug function
export const debugTokenStorage = async (): Promise<void> => {
  const token = await getToken();
  const userData = await getUserData();
  const chamberId = await getChamberId();
  const reminderData = await getReminderData();

  // console.log("🔐 Debug Token Storage:");
  // console.log("Token:", token ? "Present" : "Missing");
  // console.log("User Data:", userData);
  // console.log("Chamber ID:", chamberId);
  // console.log("Reminder Data:", reminderData);
};

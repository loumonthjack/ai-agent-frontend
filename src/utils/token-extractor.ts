// Try to extract token from Cognito's internal storage
export const extractTokenFromCognitoStorage = (): string | null => {
  try {
    // Check localStorage for Cognito tokens
    const storageKeys = Object.keys(localStorage);
    
    for (const key of storageKeys) {
      if (key.includes('CognitoIdentityServiceProvider') && key.includes('accessToken')) {
        const token = localStorage.getItem(key);
        if (token && token.startsWith('eyJ')) { // JWT tokens start with eyJ
          return token;
        }
      }
    }
    
    // Check sessionStorage as well
    const sessionKeys = Object.keys(sessionStorage);
    
    for (const key of sessionKeys) {
      if (key.includes('CognitoIdentityServiceProvider') && key.includes('accessToken')) {
        const token = sessionStorage.getItem(key);
        if (token && token.startsWith('eyJ')) {
          return token;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting token from storage:', error);
    return null;
  }
};

// Validate if a token is a valid JWT and not expired
export const isTokenValid = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    return payload.exp && payload.exp > now;
  } catch {
    return false;
  }
};

// Get a valid token using any available method
export const getValidToken = (): string | null => {
  const token = extractTokenFromCognitoStorage();
  
  if (token && isTokenValid(token)) {
    return token;
  }
  
  return null;
}; 

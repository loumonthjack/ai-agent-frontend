import { 
    signIn, 
    signOut, 
    getCurrentUser, 
    fetchAuthSession,
    AuthUser
  } from 'aws-amplify/auth';
  import { 
    setAuthToken, 
    setUserInfo, 
    clearAuthCookies,
    getAuthToken 
  } from '../utils/cookie-utils';
  import { getValidToken } from '../utils/token-extractor';
  
  export interface User {
    id: string;
    email: string;
    role: 'super-admin' | 'site-owner';
    name?: string;
  }
  
  const extractUserInfo = (authUser: AuthUser): User => {
    console.log('Auth user object:', authUser);
    
    // Try multiple ways to get the email
    const email = authUser.signInDetails?.loginId || 
                  authUser.username || 
                  '';
    
    return {
      id: authUser.userId,
      email,
      role: 'super-admin',
      name: email
    };
  };
  
  // Simple token extraction from current session
  const getTokenFromCurrentSession = async (): Promise<string | null> => {
    try {
      // Try to access the Cognito session directly
      const session = await fetchAuthSession({ forceRefresh: false });
      const token = session.tokens?.accessToken?.toString();
      
      if (token) {
        console.log('Token retrieved from current session');
        return token;
      }
    } catch (error) {
      console.error('Failed to get token from current session:', error);
    }
    
    return null;
  };
  
  const storeAuthData = async (): Promise<void> => {
    try {
      console.log('Attempting to fetch auth session...');
      const session = await fetchAuthSession();
      console.log('Auth session fetched:', session);
      
      const accessToken = session.tokens?.accessToken?.toString();
      
      console.log('Access token found:', !!accessToken);
      
      if (accessToken) {
        setAuthToken(accessToken);
        console.log('Access token stored successfully');
      }
      
      console.log('Auth data stored successfully');
    } catch (error) {
      console.error('Failed to store auth data:', error);
      
      // If fetchAuthSession fails due to identity pool issues,
      // try alternative approaches
      try {
        console.log('Attempting alternative token retrieval...');
        const token = await getTokenFromCurrentSession();
        
        if (token) {
          setAuthToken(token);
          console.log('Token stored via alternative method');
          return;
        }
      } catch (directError) {
        console.error('Alternative token retrieval also failed:', directError);
      }
      
      // Last resort: try manual extraction from browser storage
      try {
        console.log('Attempting manual token extraction...');
        const manualToken = getValidToken();
        
        if (manualToken) {
          setAuthToken(manualToken);
          console.log('Token stored via manual extraction');
          return;
        }
      } catch (manualError) {
        console.error('Manual token extraction failed:', manualError);
      }
      
      throw error;
    }
  };
  
  const checkCurrentAuthState = async (): Promise<boolean> => {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  };
  
  export const forceClearAuthState = async (): Promise<void> => {
    try {
      await signOut();
    } catch {
      // Ignore errors during signout
    }
    clearAuthCookies();
  };
  
  export const loginWithCognito = async (
    email: string, 
    password: string
  ): Promise<User> => {
    console.log('Starting login process for:', email);
    
    try {
      // Check if there's already a signed-in user
      const isCurrentlySignedIn = await checkCurrentAuthState();
      
      if (isCurrentlySignedIn) {
        console.log('User already signed in, signing out first');
        await signOut();
        clearAuthCookies();
      }
      
      console.log('Attempting sign in...');
      const signInResult = await signIn({ username: email, password });
      console.log('Sign in result:', signInResult);
      
      if (!signInResult.isSignedIn) {
        throw new Error('Sign in failed - not signed in');
      }
      
      console.log('Getting current user...');
      const authUser = await getCurrentUser();
      console.log('Current user retrieved:', authUser);
      
      const user = extractUserInfo(authUser);
      console.log('User info extracted:', user);
      
      // Store user info first
      setUserInfo(user);
      
      // Try to store auth data with retry
      let tokenStored = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Token storage attempt ${attempt}/3`);
          await storeAuthData();
          tokenStored = true;
          break;
        } catch (tokenError) {
          console.error(`Token storage attempt ${attempt} failed:`, tokenError);
          if (attempt < 3) {
            await new Promise<void>(resolve => setTimeout(resolve, 200 * attempt));
          }
        }
      }
      
      if (!tokenStored) {
        console.error('Failed to store tokens after all attempts', '');
        // Continue anyway - user is authenticated, tokens might be available later
      }
      
      console.log('Login completed successfully');
      return user;
    } catch (error) {
      console.error('Login error details:', error);
      
      // If it's the UserAlreadyAuthenticatedException, try to sign out and retry
      if (error instanceof Error && error.name === 'UserAlreadyAuthenticatedException') {
        console.log('Handling UserAlreadyAuthenticatedException, retrying...');
        await forceClearAuthState();
        
        // Retry the sign in
        const signInResult = await signIn({ username: email, password });
        
        if (!signInResult.isSignedIn) {
          throw new Error('Sign in failed after clearing session');
        }
        
        const authUser = await getCurrentUser();
        const user = extractUserInfo(authUser);
        
        setUserInfo(user);
        
        // Try to store tokens
        try {
          await storeAuthData();
        } catch (tokenError) {
          console.error('Token storage failed on retry:', tokenError);
        }
        
        console.log('Login retry completed successfully');
        return user;
      }
      
      throw error;
    }
  };
  
  export const logoutFromCognito = async (): Promise<void> => {
    await signOut();
    clearAuthCookies();
  };
  
  export const getCurrentAuthUser = async (): Promise<User | null> => {
    try {
      const authUser = await getCurrentUser();
      const user = extractUserInfo(authUser);
      
      // If we have a user but no token, try to get it
      const currentToken = getAuthToken();
      if (!currentToken) {
        console.log('User found but no token, attempting to retrieve...');
        try {
          await storeAuthData();
        } catch (error) {
          console.error('Failed to retrieve token for existing user:', error);
        }
      }
      
      return user;
    } catch (error) {
      console.log('No current user found:', error);
      clearAuthCookies();
      return null;
    }
  };
  
  export const refreshAuthSession = async (): Promise<boolean> => {
    try {
      console.log('Attempting to refresh auth session...');
      const session = await fetchAuthSession({ forceRefresh: true });
      
      const accessToken = session.tokens?.accessToken?.toString();
      if (accessToken) {
        setAuthToken(accessToken);
        console.log('Session refreshed and token updated');
        return true;
      }
      
      console.error('No access token in refreshed session', '');
      return false;
    } catch (error) {
      console.error('Session refresh failed:', error);
      clearAuthCookies();
      return false;
    }
  }; 
  
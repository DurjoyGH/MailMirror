const axios = require("axios");

/**
 * Get access token from Google using authorization code
 */
const getAccessToken = async (code) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type,
    };
  } catch (error) {
    console.error("Error getting access token:", error.response?.data || error.message);
    throw new Error("Failed to get access token from Google");
  }
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error.response?.data || error.message);
    throw new Error("Failed to refresh access token from Google");
  }
};

/**
 * Get user profile info from Google
 */
const getUserProfile = async (accessToken) => {
  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      googleId: response.data.id,
      email: response.data.email,
      name: response.data.name,
      picture: response.data.picture,
    };
  } catch (error) {
    console.error("Error getting user profile:", error.response?.data || error.message);
    throw new Error("Failed to get user profile from Google");
  }
};

/**
 * Revoke Google token
 */
const revokeToken = async (token) => {
  try {
    await axios.post(`https://oauth2.googleapis.com/revoke`, null, {
      params: { token },
    });
    return true;
  } catch (error) {
    console.error("Error revoking token:", error.response?.data || error.message);
    return false;
  }
};

/**
 * Get Gmail messages (requires gmail.readonly scope)
 */
const getGmailMessages = async (accessToken, maxResults = 10) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/gmail/v1/users/me/messages",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          maxResults,
          q: "from:*", // Get all messages
        },
      }
    );

    return response.data.messages || [];
  } catch (error) {
    console.error("Error getting Gmail messages:", error.response?.data || error.message);
    throw new Error("Failed to get Gmail messages");
  }
};

/**
 * Get a specific Gmail message
 */
const getGmailMessage = async (accessToken, messageId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          format: "full",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error getting Gmail message:", error.response?.data || error.message);
    throw new Error("Failed to get Gmail message");
  }
};

/**
 * Get Gmail message attachment/body chunk by attachmentId
 */
const getGmailAttachment = async (accessToken, messageId, attachmentId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error getting Gmail attachment:", error.response?.data || error.message);
    throw new Error("Failed to get Gmail attachment");
  }
};

module.exports = {
  getAccessToken,
  refreshAccessToken,
  getUserProfile,
  revokeToken,
  getGmailMessages,
  getGmailMessage,
  getGmailAttachment,
};

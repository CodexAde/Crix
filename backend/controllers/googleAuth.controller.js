import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.model.js';
import { cookieOptions } from './user.controller.js';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // Use FRONTEND_URL since requests now come through Vercel proxy
  `${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/v1/users/auth/google/callback`
);

export const googleAuth = (req, res) => {
  const authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
  res.redirect(authorizeUrl);
};

export const googleAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const userInfoResponse = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });
    
    const { email, name, sub, picture } = userInfoResponse.data;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user (Generate dummy password)
      user = await User.create({
        name,
        email,
        avatar: picture || "",
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Secure-ish random
        academicInfo: { isOnboarded: false },
        personaProfile: null,
        isApproved: true // Everyone is approved by default now
      });
    } else if (!user.avatar && picture) {
        // Update avatar if missing
        user.avatar = picture;
        await user.save({ validateBeforeSave: false });
    }

    // Approval check removed
    // if (!user.isApproved) {
    //     return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/pending-approval`);
    // }

    // Generate our app's tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Redirect to frontend
    res.cookie("accessToken", accessToken, cookieOptions)
       .cookie("refreshToken", refreshToken, cookieOptions)
       .redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`);

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`);
  }
};

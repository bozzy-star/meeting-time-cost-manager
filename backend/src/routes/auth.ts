import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken, hashPassword, comparePassword, generateSessionToken, generateRefreshToken } from '../utils/auth';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import * as process from 'process';

const router = express.Router();
const prisma = new PrismaClient();

// Login endpoint
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        error: {
          message: 'Email and password are required',
          status: 400,
          code: 'MISSING_CREDENTIALS'
        }
      });
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            subscriptionPlan: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            level: true,
            permissions: true
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    if (!user) {
      res.status(401).json({
        error: {
          message: 'Invalid email or password',
          status: 401,
          code: 'INVALID_CREDENTIALS'
        }
      });
      return;
    }

    // Check if user is active
    if (user.status !== 'active') {
      res.status(401).json({
        error: {
          message: 'Account is not active',
          status: 401,
          code: 'ACCOUNT_INACTIVE'
        }
      });
      return;
    }

    // Verify password
    if (!user.passwordHash) {
      res.status(401).json({
        error: {
          message: 'Please set up your password',
          status: 401,
          code: 'PASSWORD_NOT_SET'
        }
      });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        error: {
          message: 'Invalid email or password',
          status: 401,
          code: 'INVALID_CREDENTIALS'
        }
      });
      return;
    }

    // Generate tokens
    const accessToken = generateToken({
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
      roleId: user.roleId || ''
    });

    const sessionToken = generateSessionToken();
    const refreshToken = generateRefreshToken();

    // Create session in database
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        deviceInfo: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip || req.connection.remoteAddress || 'Unknown'
      }
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Return user info and tokens
    res.json({
      message: 'Login successful',
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          organization: user.organization,
          role: user.role,
          department: user.department,
          lastLoginAt: user.lastLoginAt
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Register endpoint (for admin user creation)
router.post('/register', async (req, res): Promise<void> => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      organizationId,
      roleId,
      departmentId
    } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName || !organizationId) {
      res.status(400).json({
        error: {
          message: 'Required fields: email, password, firstName, lastName, organizationId',
          status: 400,
          code: 'MISSING_FIELDS'
        }
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({
        error: {
          message: 'User with this email already exists',
          status: 409,
          code: 'USER_EXISTS'
        }
      });
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        organizationId,
        roleId,
        departmentId,
        status: 'active',
        emailVerifiedAt: new Date()
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          organization: user.organization,
          role: user.role,
          department: user.department,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const sessionToken = req.headers.authorization?.split(' ')[1];
    
    if (sessionToken) {
      // Revoke session
      await prisma.session.updateMany({
        where: {
          userId: req.user!.userId,
          sessionToken
        },
        data: {
          revokedAt: new Date()
        }
      });
    }

    res.json({
      message: 'Logout successful',
      status: 'success'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            subscriptionPlan: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            level: true,
            permissions: true
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({
        error: {
          message: 'User not found',
          status: 404,
          code: 'USER_NOT_FOUND'
        }
      });
      return;
    }

    res.json({
      message: 'Profile retrieved successfully',
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          phone: user.phone,
          timezone: user.timezone,
          locale: user.locale,
          organization: user.organization,
          role: user.role,
          department: user.department,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        error: {
          message: 'Refresh token is required',
          status: 400,
          code: 'MISSING_REFRESH_TOKEN'
        }
      });
      return;
    }

    // Find session with refresh token
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          include: {
            organization: true,
            role: true
          }
        }
      }
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      res.status(401).json({
        error: {
          message: 'Invalid or expired refresh token',
          status: 401,
          code: 'INVALID_REFRESH_TOKEN'
        }
      });
      return;
    }

    // Generate new access token
    const accessToken = generateToken({
      userId: session.user.id,
      email: session.user.email,
      organizationId: session.user.organizationId,
      roleId: session.user.roleId || ''
    });

    // Update session last accessed
    await prisma.session.update({
      where: { id: session.id },
      data: { lastAccessedAt: new Date() }
    });

    res.json({
      message: 'Token refreshed successfully',
      status: 'success',
      data: {
        accessToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

export default router;
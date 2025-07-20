import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import * as process from 'process';

const router = express.Router();
const prisma = new PrismaClient();

// Get participants for a specific meeting
router.get('/:meetingId/participants', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { meetingId } = req.params;
    const organizationId = req.user!.organizationId;

    // Check if meeting exists and user has access
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        organizationId,
        deletedAt: null
      }
    });

    if (!meeting) {
      res.status(404).json({
        error: {
          message: 'Meeting not found',
          status: 404,
          code: 'MEETING_NOT_FOUND'
        }
      });
      return;
    }

    const participants = await prisma.meetingParticipant.findMany({
      where: {
        meetingId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
            avatarUrl: true,
            hourlyRate: true,
            role: {
              select: {
                id: true,
                name: true,
                level: true,
                defaultHourlyRate: true
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
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({
      message: 'Participants retrieved successfully',
      status: 'success',
      data: participants,
      count: participants.length
    });

  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve participants',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Add participant to meeting
router.post('/:meetingId/participants', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { meetingId } = req.params;
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    const {
      participantUserId,
      role = 'participant',
      isRequired = true,
      hourlyRateOverride,
      notes
    } = req.body;

    if (!participantUserId) {
      res.status(400).json({
        error: {
          message: 'participantUserId is required',
          status: 400,
          code: 'MISSING_USER_ID'
        }
      });
      return;
    }

    // Check if meeting exists and user has permission
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        organizationId,
        deletedAt: null
      }
    });

    if (!meeting) {
      res.status(404).json({
        error: {
          message: 'Meeting not found',
          status: 404,
          code: 'MEETING_NOT_FOUND'
        }
      });
      return;
    }

    // Check if user is organizer or has permission
    if (meeting.organizerId !== userId) {
      res.status(403).json({
        error: {
          message: 'Only meeting organizer can add participants',
          status: 403,
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      });
      return;
    }

    // Check if participant user exists in the organization
    const participantUser = await prisma.user.findFirst({
      where: {
        id: participantUserId,
        organizationId,
        status: 'active'
      }
    });

    if (!participantUser) {
      res.status(404).json({
        error: {
          message: 'Participant user not found in organization',
          status: 404,
          code: 'USER_NOT_FOUND'
        }
      });
      return;
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.meetingParticipant.findFirst({
      where: {
        meetingId,
        userId: participantUserId
      }
    });

    if (existingParticipant) {
      res.status(409).json({
        error: {
          message: 'User is already a participant in this meeting',
          status: 409,
          code: 'ALREADY_PARTICIPANT'
        }
      });
      return;
    }

    // Add participant
    const participant = await prisma.meetingParticipant.create({
      data: {
        meetingId,
        userId: participantUserId,
        role,
        isRequired,
        hourlyRateOverride,
        notes,
        invitationStatus: 'pending'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
            avatarUrl: true,
            hourlyRate: true,
            role: {
              select: {
                id: true,
                name: true,
                level: true,
                defaultHourlyRate: true
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
        }
      }
    });

    res.status(201).json({
      message: 'Participant added successfully',
      status: 'success',
      data: participant
    });

  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to add participant',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Update participant
router.put('/:meetingId/participants/:participantId', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { meetingId, participantId } = req.params;
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    const {
      role,
      invitationStatus,
      attendanceStatus,
      isRequired,
      hourlyRateOverride,
      notes
    } = req.body;

    // Check if meeting exists and user has access
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        organizationId,
        deletedAt: null
      }
    });

    if (!meeting) {
      res.status(404).json({
        error: {
          message: 'Meeting not found',
          status: 404,
          code: 'MEETING_NOT_FOUND'
        }
      });
      return;
    }

    // Check if participant exists
    const participant = await prisma.meetingParticipant.findFirst({
      where: {
        id: participantId,
        meetingId
      }
    });

    if (!participant) {
      res.status(404).json({
        error: {
          message: 'Participant not found',
          status: 404,
          code: 'PARTICIPANT_NOT_FOUND'
        }
      });
      return;
    }

    // Check permissions - organizer can update all fields, participant can only update their own response
    const canUpdateAll = meeting.organizerId === userId;
    const canUpdateOwnResponse = participant.userId === userId;

    if (!canUpdateAll && !canUpdateOwnResponse) {
      res.status(403).json({
        error: {
          message: 'Insufficient permissions to update participant',
          status: 403,
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      });
      return;
    }

    // Determine what fields can be updated
    const updateData: any = {};

    if (canUpdateAll) {
      // Organizer can update all fields
      if (role !== undefined) updateData.role = role;
      if (isRequired !== undefined) updateData.isRequired = isRequired;
      if (hourlyRateOverride !== undefined) updateData.hourlyRateOverride = hourlyRateOverride;
      if (notes !== undefined) updateData.notes = notes;
      if (invitationStatus !== undefined) updateData.invitationStatus = invitationStatus;
      if (attendanceStatus !== undefined) updateData.attendanceStatus = attendanceStatus;
    } else if (canUpdateOwnResponse) {
      // Participant can only update their response
      if (invitationStatus !== undefined) updateData.invitationStatus = invitationStatus;
      if (attendanceStatus !== undefined) updateData.attendanceStatus = attendanceStatus;
    }

    // Update participant
    const updatedParticipant = await prisma.meetingParticipant.update({
      where: { id: participantId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
            avatarUrl: true,
            hourlyRate: true,
            role: {
              select: {
                id: true,
                name: true,
                level: true,
                defaultHourlyRate: true
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
        }
      }
    });

    res.json({
      message: 'Participant updated successfully',
      status: 'success',
      data: updatedParticipant
    });

  } catch (error) {
    console.error('Update participant error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update participant',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Remove participant from meeting
router.delete('/:meetingId/participants/:participantId', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { meetingId, participantId } = req.params;
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    // Check if meeting exists and user has permission
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        organizationId,
        deletedAt: null
      }
    });

    if (!meeting) {
      res.status(404).json({
        error: {
          message: 'Meeting not found',
          status: 404,
          code: 'MEETING_NOT_FOUND'
        }
      });
      return;
    }

    // Check if participant exists
    const participant = await prisma.meetingParticipant.findFirst({
      where: {
        id: participantId,
        meetingId
      }
    });

    if (!participant) {
      res.status(404).json({
        error: {
          message: 'Participant not found',
          status: 404,
          code: 'PARTICIPANT_NOT_FOUND'
        }
      });
      return;
    }

    // Check permissions - only organizer can remove participants
    if (meeting.organizerId !== userId) {
      res.status(403).json({
        error: {
          message: 'Only meeting organizer can remove participants',
          status: 403,
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      });
      return;
    }

    // Don't allow removing the organizer
    if (participant.role === 'organizer') {
      res.status(400).json({
        error: {
          message: 'Cannot remove meeting organizer',
          status: 400,
          code: 'CANNOT_REMOVE_ORGANIZER'
        }
      });
      return;
    }

    // Remove participant
    await prisma.meetingParticipant.delete({
      where: { id: participantId }
    });

    res.json({
      message: 'Participant removed successfully',
      status: 'success'
    });

  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to remove participant',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Join meeting (for participants)
router.post('/:meetingId/participants/:participantId/join', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { meetingId, participantId } = req.params;
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    // Check if meeting exists
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        organizationId,
        deletedAt: null
      }
    });

    if (!meeting) {
      res.status(404).json({
        error: {
          message: 'Meeting not found',
          status: 404,
          code: 'MEETING_NOT_FOUND'
        }
      });
      return;
    }

    // Check if participant exists and belongs to user
    const participant = await prisma.meetingParticipant.findFirst({
      where: {
        id: participantId,
        meetingId,
        userId
      }
    });

    if (!participant) {
      res.status(404).json({
        error: {
          message: 'Participant not found or access denied',
          status: 404,
          code: 'PARTICIPANT_NOT_FOUND'
        }
      });
      return;
    }

    // Check if meeting is in progress
    if (meeting.status !== 'in_progress') {
      res.status(400).json({
        error: {
          message: 'Meeting is not in progress',
          status: 400,
          code: 'MEETING_NOT_IN_PROGRESS'
        }
      });
      return;
    }

    // Update participant join time
    const updatedParticipant = await prisma.meetingParticipant.update({
      where: { id: participantId },
      data: {
        joinedAt: new Date(),
        attendanceStatus: 'present'
      }
    });

    // Create participant tracker if meeting tracker exists
    const meetingTracker = await prisma.meetingTracker.findFirst({
      where: {
        meetingId,
        status: 'active'
      }
    });

    if (meetingTracker) {
      await prisma.participantTracker.create({
        data: {
          meetingTrackerId: meetingTracker.id,
          participantId,
          joinedAt: new Date(),
          isActive: true
        }
      });
    }

    res.json({
      message: 'Joined meeting successfully',
      status: 'success',
      data: updatedParticipant
    });

  } catch (error) {
    console.error('Join meeting error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to join meeting',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Leave meeting (for participants)
router.post('/:meetingId/participants/:participantId/leave', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { meetingId, participantId } = req.params;
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    // Check if meeting exists
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        organizationId,
        deletedAt: null
      }
    });

    if (!meeting) {
      res.status(404).json({
        error: {
          message: 'Meeting not found',
          status: 404,
          code: 'MEETING_NOT_FOUND'
        }
      });
      return;
    }

    // Check if participant exists and belongs to user
    const participant = await prisma.meetingParticipant.findFirst({
      where: {
        id: participantId,
        meetingId,
        userId
      }
    });

    if (!participant) {
      res.status(404).json({
        error: {
          message: 'Participant not found or access denied',
          status: 404,
          code: 'PARTICIPANT_NOT_FOUND'
        }
      });
      return;
    }

    // Update participant leave time
    const updatedParticipant = await prisma.meetingParticipant.update({
      where: { id: participantId },
      data: {
        leftAt: new Date(),
        attendanceStatus: 'left_early'
      }
    });

    // Update participant tracker if exists
    const participantTracker = await prisma.participantTracker.findFirst({
      where: {
        participantId,
        isActive: true
      }
    });

    if (participantTracker) {
      const leaveTime = new Date();
      const duration = Math.ceil((leaveTime.getTime() - participantTracker.joinedAt.getTime()) / (1000 * 60));

      await prisma.participantTracker.update({
        where: { id: participantTracker.id },
        data: {
          leftAt: leaveTime,
          totalDurationMinutes: duration,
          isActive: false
        }
      });
    }

    res.json({
      message: 'Left meeting successfully',
      status: 'success',
      data: updatedParticipant
    });

  } catch (error) {
    console.error('Leave meeting error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to leave meeting',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

export default router;
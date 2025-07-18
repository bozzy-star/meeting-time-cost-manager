import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { CreateMeetingRequest, UpdateMeetingRequest } from '../types/api';

const router = express.Router();
const prisma = new PrismaClient();

// Get all meetings for the authenticated user's organization
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    const meetings = await prisma.meeting.findMany({
      where: {
        organizationId,
        deletedAt: null
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
            avatarUrl: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                displayName: true,
                email: true,
                avatarUrl: true
              }
            }
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            location: true,
            capacity: true,
            hourlyCost: true
          }
        },
        cost: true,
        analytics: {
          select: {
            efficiencyScore: true,
            productivityScore: true,
            attendanceRate: true,
            totalCost: true,
            costPerParticipant: true
          }
        }
      },
      orderBy: {
        scheduledStartAt: 'desc'
      }
    });

    res.json({
      message: 'Meetings retrieved successfully',
      status: 'success',
      data: meetings,
      count: meetings.length
    });

  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve meetings',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Get a specific meeting by ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { id } = req.params;
    const organizationId = req.user!.organizationId;

    const meeting = await prisma.meeting.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
            avatarUrl: true,
            role: {
              select: {
                name: true,
                level: true
              }
            }
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                displayName: true,
                email: true,
                avatarUrl: true,
                role: {
                  select: {
                    name: true,
                    level: true
                  }
                },
                department: {
                  select: {
                    name: true,
                    code: true
                  }
                }
              }
            }
          }
        },
        room: true,
        cost: true,
        analytics: true,
        tracker: {
          include: {
            participantTrackers: {
              include: {
                participant: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        displayName: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
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

    res.json({
      message: 'Meeting retrieved successfully',
      status: 'success',
      data: meeting
    });

  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve meeting',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Create a new meeting
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    const {
      title,
      description,
      meetingType = 'regular',
      category,
      location,
      roomId,
      isOnline = false,
      meetingUrl,
      scheduledStartAt,
      scheduledEndAt,
      agenda,
      objectives,
      expectedOutcomes,
      expectedRevenue,
      priority = 'medium',
      tags = '',
      participants = []
    } = req.body;

    // Validate required fields
    if (!title || !scheduledStartAt || !scheduledEndAt) {
      res.status(400).json({
        error: {
          message: 'Required fields: title, scheduledStartAt, scheduledEndAt',
          status: 400,
          code: 'MISSING_REQUIRED_FIELDS'
        }
      });
      return;
    }

    // Validate dates
    const startDate = new Date(scheduledStartAt);
    const endDate = new Date(scheduledEndAt);

    if (startDate >= endDate) {
      res.status(400).json({
        error: {
          message: 'End time must be after start time',
          status: 400,
          code: 'INVALID_DATE_RANGE'
        }
      });
      return;
    }

    // Check if room is available (if specified)
    if (roomId) {
      const conflictingMeeting = await prisma.meeting.findFirst({
        where: {
          roomId,
          deletedAt: null,
          status: {
            not: 'cancelled'
          },
          OR: [
            {
              AND: [
                { scheduledStartAt: { lte: startDate } },
                { scheduledEndAt: { gt: startDate } }
              ]
            },
            {
              AND: [
                { scheduledStartAt: { lt: endDate } },
                { scheduledEndAt: { gte: endDate } }
              ]
            },
            {
              AND: [
                { scheduledStartAt: { gte: startDate } },
                { scheduledEndAt: { lte: endDate } }
              ]
            }
          ]
        }
      });

      if (conflictingMeeting) {
        res.status(409).json({
          error: {
            message: 'Room is not available at the specified time',
            status: 409,
            code: 'ROOM_CONFLICT'
          }
        });
        return;
      }
    }

    // Create meeting
    const meeting = await prisma.meeting.create({
      data: {
        organizationId,
        organizerId: userId,
        title,
        description,
        meetingType,
        category,
        location,
        roomId,
        isOnline,
        meetingUrl,
        scheduledStartAt: startDate,
        scheduledEndAt: endDate,
        agenda: agenda ? JSON.stringify(agenda) : null,
        objectives: objectives ? JSON.stringify(objectives) : null,
        expectedOutcomes,
        expectedRevenue,
        priority,
        tags,
        status: 'scheduled'
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            location: true,
            capacity: true,
            hourlyCost: true
          }
        }
      }
    });

    // Add participants
    if (participants.length > 0) {
      const participantData = participants.map((participant: any) => ({
        meetingId: meeting.id,
        userId: participant.userId,
        role: participant.role || 'participant',
        isRequired: participant.isRequired !== false,
        hourlyRateOverride: participant.hourlyRateOverride || null
      }));

      await prisma.meetingParticipant.createMany({
        data: participantData
      });
    }

    // Add organizer as participant
    await prisma.meetingParticipant.create({
      data: {
        meetingId: meeting.id,
        userId: userId,
        role: 'organizer',
        invitationStatus: 'accepted',
        isRequired: true
      }
    });

    res.status(201).json({
      message: 'Meeting created successfully',
      status: 'success',
      data: meeting
    });

  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create meeting',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Update a meeting
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    // Check if meeting exists and user has permission
    const existingMeeting = await prisma.meeting.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null
      }
    });

    if (!existingMeeting) {
      res.status(404).json({
        error: {
          message: 'Meeting not found',
          status: 404,
          code: 'MEETING_NOT_FOUND'
        }
      });
      return;
    }

    // Check if user is the organizer or has permission to edit
    if (existingMeeting.organizerId !== userId) {
      // TODO: Check if user has admin/manager permissions
      res.status(403).json({
        error: {
          message: 'You do not have permission to edit this meeting',
          status: 403,
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      });
      return;
    }

    const {
      title,
      description,
      meetingType,
      category,
      location,
      roomId,
      isOnline,
      meetingUrl,
      scheduledStartAt,
      scheduledEndAt,
      agenda,
      objectives,
      expectedOutcomes,
      expectedRevenue,
      priority,
      tags,
      status
    } = req.body;

    // Validate dates if provided
    if (scheduledStartAt && scheduledEndAt) {
      const startDate = new Date(scheduledStartAt);
      const endDate = new Date(scheduledEndAt);

      if (startDate >= endDate) {
        res.status(400).json({
          error: {
            message: 'End time must be after start time',
            status: 400,
            code: 'INVALID_DATE_RANGE'
          }
        });
        return;
      }
    }

    // Update meeting
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(meetingType && { meetingType }),
        ...(category !== undefined && { category }),
        ...(location !== undefined && { location }),
        ...(roomId !== undefined && { roomId }),
        ...(isOnline !== undefined && { isOnline }),
        ...(meetingUrl !== undefined && { meetingUrl }),
        ...(scheduledStartAt && { scheduledStartAt: new Date(scheduledStartAt) }),
        ...(scheduledEndAt && { scheduledEndAt: new Date(scheduledEndAt) }),
        ...(agenda !== undefined && { agenda: agenda ? JSON.stringify(agenda) : null }),
        ...(objectives !== undefined && { objectives: objectives ? JSON.stringify(objectives) : null }),
        ...(expectedOutcomes !== undefined && { expectedOutcomes }),
        ...(expectedRevenue !== undefined && { expectedRevenue }),
        ...(priority && { priority }),
        ...(tags !== undefined && { tags }),
        ...(status && { status })
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            location: true,
            capacity: true,
            hourlyCost: true
          }
        }
      }
    });

    res.json({
      message: 'Meeting updated successfully',
      status: 'success',
      data: updatedMeeting
    });

  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update meeting',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Delete a meeting (soft delete)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    // Check if meeting exists and user has permission
    const existingMeeting = await prisma.meeting.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null
      }
    });

    if (!existingMeeting) {
      res.status(404).json({
        error: {
          message: 'Meeting not found',
          status: 404,
          code: 'MEETING_NOT_FOUND'
        }
      });
      return;
    }

    // Check if user is the organizer or has permission to delete
    if (existingMeeting.organizerId !== userId) {
      // TODO: Check if user has admin/manager permissions
      res.status(403).json({
        error: {
          message: 'You do not have permission to delete this meeting',
          status: 403,
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      });
      return;
    }

    // Soft delete the meeting
    await prisma.meeting.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'cancelled'
      }
    });

    res.json({
      message: 'Meeting deleted successfully',
      status: 'success'
    });

  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to delete meeting',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Start meeting (for real-time tracking)
router.post('/:id/start', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    // Check if meeting exists
    const meeting = await prisma.meeting.findFirst({
      where: {
        id,
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

    // Check if user is a participant
    const participant = await prisma.meetingParticipant.findFirst({
      where: {
        meetingId: id,
        userId
      }
    });

    if (!participant) {
      res.status(403).json({
        error: {
          message: 'You are not a participant in this meeting',
          status: 403,
          code: 'NOT_PARTICIPANT'
        }
      });
      return;
    }

    // Check if meeting is already started
    if (meeting.actualStartAt) {
      res.status(400).json({
        error: {
          message: 'Meeting has already started',
          status: 400,
          code: 'ALREADY_STARTED'
        }
      });
      return;
    }

    // Start the meeting
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        actualStartAt: new Date(),
        status: 'in_progress'
      }
    });

    // Create meeting tracker
    const tracker = await prisma.meetingTracker.create({
      data: {
        meetingId: id,
        trackerSessionId: `session_${id}_${Date.now()}`,
        startedBy: userId,
        startedAt: new Date(),
        status: 'active'
      }
    });

    res.json({
      message: 'Meeting started successfully',
      status: 'success',
      data: {
        meeting: updatedMeeting,
        tracker
      }
    });

  } catch (error) {
    console.error('Start meeting error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to start meeting',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// End meeting
router.post('/:id/end', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const organizationId = req.user!.organizationId;

    // Check if meeting exists
    const meeting = await prisma.meeting.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null
      },
      include: {
        tracker: true,
        participants: {
          include: {
            user: {
              select: {
                hourlyRate: true,
                role: {
                  select: {
                    defaultHourlyRate: true
                  }
                }
              }
            }
          }
        },
        room: {
          select: {
            hourlyCost: true
          }
        }
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

    // Check if meeting is in progress
    if (meeting.status !== 'in_progress' || !meeting.actualStartAt) {
      res.status(400).json({
        error: {
          message: 'Meeting is not in progress',
          status: 400,
          code: 'NOT_IN_PROGRESS'
        }
      });
      return;
    }

    const endTime = new Date();
    const actualDurationMinutes = Math.ceil((endTime.getTime() - meeting.actualStartAt.getTime()) / (1000 * 60));

    // End the meeting
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        actualEndAt: endTime,
        status: 'completed'
      }
    });

    // Update tracker
    if (meeting.tracker) {
      await prisma.meetingTracker.update({
        where: { id: meeting.tracker.id },
        data: {
          endedAt: endTime,
          status: 'completed'
        }
      });
    }

    // Calculate meeting cost
    let totalCost = 0;
    let directCost = 0;
    let indirectCost = 0;
    const participantCount = meeting.participants.length;
    let totalHourlyRate = 0;

    // Calculate participant costs
    meeting.participants.forEach(participant => {
      const hourlyRate = participant.hourlyRateOverride || 
                        participant.user.hourlyRate || 
                        participant.user.role?.defaultHourlyRate || 
                        4000;
      
      totalHourlyRate += hourlyRate;
      const participantCost = (hourlyRate * actualDurationMinutes) / 60;
      directCost += participantCost;
    });

    // Add room cost
    if (meeting.room?.hourlyCost) {
      const roomCost = (meeting.room.hourlyCost * actualDurationMinutes) / 60;
      indirectCost += roomCost;
    }

    totalCost = directCost + indirectCost;
    const averageHourlyRate = participantCount > 0 ? totalHourlyRate / participantCount : 0;
    const costPerMinute = actualDurationMinutes > 0 ? totalCost / actualDurationMinutes : 0;

    // Create or update meeting cost
    const costData = {
      meetingId: id,
      totalCost,
      directCost,
      indirectCost,
      opportunityCost: 0,
      participantCount,
      actualDurationMinutes,
      scheduledDurationMinutes: Math.ceil((meeting.scheduledEndAt.getTime() - meeting.scheduledStartAt.getTime()) / (1000 * 60)),
      averageHourlyRate,
      costPerMinute,
      efficiencyScore: 0.85, // TODO: Calculate based on actual metrics
      roiPercentage: meeting.expectedRevenue ? ((meeting.expectedRevenue - totalCost) / totalCost) * 100 : null,
      costBreakdown: JSON.stringify({
        personnel: directCost,
        room: meeting.room?.hourlyCost ? (meeting.room.hourlyCost * actualDurationMinutes) / 60 : 0,
        equipment: 0,
        other: 0
      })
    };

    await prisma.meetingCost.upsert({
      where: { meetingId: id },
      create: costData,
      update: costData
    });

    res.json({
      message: 'Meeting ended successfully',
      status: 'success',
      data: {
        meeting: updatedMeeting,
        cost: costData
      }
    });

  } catch (error) {
    console.error('End meeting error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to end meeting',
        status: 500,
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

export default router;
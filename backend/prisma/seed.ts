import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Demo Corporation',
      slug: 'demo-corp',
      domain: 'demo.com',
      industry: 'Technology',
      employeeCount: 150,
      timezone: 'Asia/Tokyo',
      currency: 'JPY',
      subscriptionPlan: 'premium',
      settings: JSON.stringify({
        allowExternalMeetings: true,
        requireMeetingApproval: false,
        defaultMeetingDuration: 60
      })
    }
  });

  // Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        organizationId: organization.id,
        name: '技術部',
        code: 'TECH',
        description: 'システム開発・運用',
        costCenter: 'CC001',
        budgetAnnual: 50000000
      }
    }),
    prisma.department.create({
      data: {
        organizationId: organization.id,
        name: '営業部',
        code: 'SALES',
        description: '営業・顧客対応',
        costCenter: 'CC002',
        budgetAnnual: 30000000
      }
    }),
    prisma.department.create({
      data: {
        organizationId: organization.id,
        name: '人事部',
        code: 'HR',
        description: '人事・総務',
        costCenter: 'CC003',
        budgetAnnual: 15000000
      }
    })
  ]);

  // Create roles
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: 'CEO',
        level: 1,
        grade: 'E1',
        description: '最高経営責任者',
        defaultHourlyRate: 15000,
        permissions: JSON.stringify({
          admin: true,
          manage_all: true,
          view_all: true
        })
      }
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: '部長',
        level: 3,
        grade: 'M3',
        description: '部門責任者',
        defaultHourlyRate: 8000,
        permissions: JSON.stringify({
          manage_department: true,
          view_department: true,
          create_meetings: true
        })
      }
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: '課長',
        level: 4,
        grade: 'M4',
        description: '課責任者',
        defaultHourlyRate: 6000,
        permissions: JSON.stringify({
          manage_team: true,
          view_team: true,
          create_meetings: true
        })
      }
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: 'シニアエンジニア',
        level: 5,
        grade: 'S5',
        description: '上級技術者',
        defaultHourlyRate: 5000,
        permissions: JSON.stringify({
          view_own: true,
          create_meetings: true
        })
      }
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: 'エンジニア',
        level: 6,
        grade: 'G6',
        description: '一般技術者',
        defaultHourlyRate: 4000,
        permissions: JSON.stringify({
          view_own: true,
          create_meetings: false
        })
      }
    })
  ]);

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        organizationId: organization.id,
        departmentId: departments[0].id,
        roleId: roles[0].id,
        employeeId: 'EMP001',
        email: 'ceo@demo.com',
        passwordHash: hashedPassword,
        firstName: '太郎',
        lastName: '山田',
        displayName: '山田太郎',
        phone: '090-1234-5678',
        hourlyRate: 15000,
        monthlySalary: 1500000,
        employmentType: 'full_time',
        hiredAt: new Date('2020-01-01'),
        status: 'active',
        emailVerifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        departmentId: departments[0].id,
        roleId: roles[1].id,
        employeeId: 'EMP002',
        email: 'tech-manager@demo.com',
        passwordHash: hashedPassword,
        firstName: '花子',
        lastName: '佐藤',
        displayName: '佐藤花子',
        phone: '090-2345-6789',
        hourlyRate: 8000,
        monthlySalary: 800000,
        employmentType: 'full_time',
        hiredAt: new Date('2020-04-01'),
        status: 'active',
        emailVerifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        departmentId: departments[0].id,
        roleId: roles[3].id,
        employeeId: 'EMP003',
        email: 'senior-dev@demo.com',
        passwordHash: hashedPassword,
        firstName: '次郎',
        lastName: '田中',
        displayName: '田中次郎',
        phone: '090-3456-7890',
        hourlyRate: 5000,
        monthlySalary: 600000,
        employmentType: 'full_time',
        hiredAt: new Date('2021-01-01'),
        status: 'active',
        emailVerifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        departmentId: departments[1].id,
        roleId: roles[1].id,
        employeeId: 'EMP004',
        email: 'sales-manager@demo.com',
        passwordHash: hashedPassword,
        firstName: '三郎',
        lastName: '鈴木',
        displayName: '鈴木三郎',
        phone: '090-4567-8901',
        hourlyRate: 7000,
        monthlySalary: 750000,
        employmentType: 'full_time',
        hiredAt: new Date('2020-06-01'),
        status: 'active',
        emailVerifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        departmentId: departments[2].id,
        roleId: roles[2].id,
        employeeId: 'EMP005',
        email: 'hr-manager@demo.com',
        passwordHash: hashedPassword,
        firstName: '美香',
        lastName: '高橋',
        displayName: '高橋美香',
        phone: '090-5678-9012',
        hourlyRate: 6000,
        monthlySalary: 650000,
        employmentType: 'full_time',
        hiredAt: new Date('2020-08-01'),
        status: 'active',
        emailVerifiedAt: new Date()
      }
    })
  ]);

  // Update department managers
  await Promise.all([
    prisma.department.update({
      where: { id: departments[0].id },
      data: { managerId: users[1].id }
    }),
    prisma.department.update({
      where: { id: departments[1].id },
      data: { managerId: users[3].id }
    }),
    prisma.department.update({
      where: { id: departments[2].id },
      data: { managerId: users[4].id }
    })
  ]);

  // Create meeting rooms
  const meetingRooms = await Promise.all([
    prisma.meetingRoom.create({
      data: {
        organizationId: organization.id,
        name: '大会議室A',
        location: '3階',
        capacity: 20,
        hourlyCost: 2000,
        equipment: JSON.stringify([
          'プロジェクター',
          'ホワイトボード',
          'テレビ会議システム',
          'Wi-Fi'
        ])
      }
    }),
    prisma.meetingRoom.create({
      data: {
        organizationId: organization.id,
        name: '中会議室B',
        location: '2階',
        capacity: 10,
        hourlyCost: 1000,
        equipment: JSON.stringify([
          'モニター',
          'ホワイトボード',
          'Wi-Fi'
        ])
      }
    }),
    prisma.meetingRoom.create({
      data: {
        organizationId: organization.id,
        name: '小会議室C',
        location: '2階',
        capacity: 6,
        hourlyCost: 500,
        equipment: JSON.stringify([
          'モニター',
          'Wi-Fi'
        ])
      }
    })
  ]);

  // Create cost template
  const costTemplate = await prisma.costTemplate.create({
    data: {
      organizationId: organization.id,
      name: 'デフォルトコスト設定',
      description: '標準的な会議コスト計算テンプレート',
      currency: 'JPY',
      overtimeMultiplier: 1.25,
      holidayMultiplier: 1.5,
      nightShiftMultiplier: 1.2,
      isDefault: true
    }
  });

  // Create cost rates for roles
  const costRates = await Promise.all(
    roles.map(role => 
      prisma.costRate.create({
        data: {
          costTemplateId: costTemplate.id,
          roleId: role.id,
          baseHourlyRate: role.defaultHourlyRate || 4000,
          effectiveFrom: new Date('2024-01-01'),
          rateType: 'standard'
        }
      })
    )
  );

  // Create sample meetings
  const meetings = await Promise.all([
    prisma.meeting.create({
      data: {
        organizationId: organization.id,
        organizerId: users[1].id,
        title: '週次技術レビュー',
        description: '技術チームの週次進捗確認とレビュー',
        meetingType: 'recurring',
        category: 'development',
        location: '大会議室A',
        roomId: meetingRooms[0].id,
        scheduledStartAt: new Date('2024-07-15T10:00:00Z'),
        scheduledEndAt: new Date('2024-07-15T11:00:00Z'),
        actualStartAt: new Date('2024-07-15T10:05:00Z'),
        actualEndAt: new Date('2024-07-15T11:10:00Z'),
        status: 'completed',
        agenda: JSON.stringify([
          'プロジェクト進捗報告',
          '技術課題の共有',
          '来週のタスク確認'
        ]),
        objectives: JSON.stringify([
          'チーム全体の進捗共有',
          '技術的な問題の早期発見',
          'リソース調整の検討'
        ]),
        expectedOutcomes: '技術チームの生産性向上',
        priority: 'high',
        tags: '技術,レビュー,週次'
      }
    }),
    prisma.meeting.create({
      data: {
        organizationId: organization.id,
        organizerId: users[3].id,
        title: '月次営業会議',
        description: '月次売上実績と来月の営業戦略検討',
        meetingType: 'recurring',
        category: 'sales',
        location: '中会議室B',
        roomId: meetingRooms[1].id,
        scheduledStartAt: new Date('2024-07-15T14:00:00Z'),
        scheduledEndAt: new Date('2024-07-15T15:30:00Z'),
        status: 'scheduled',
        agenda: JSON.stringify([
          '月次売上実績報告',
          '顧客案件の進捗確認',
          '来月の営業戦略検討'
        ]),
        objectives: JSON.stringify([
          '売上目標達成状況の確認',
          '営業戦略の調整',
          'チームモチベーションの向上'
        ]),
        expectedRevenue: 5000000,
        priority: 'high',
        tags: '営業,月次,戦略'
      }
    }),
    prisma.meeting.create({
      data: {
        organizationId: organization.id,
        organizerId: users[0].id,
        title: '四半期経営会議',
        description: '四半期業績レビューと次期戦略決定',
        meetingType: 'strategic',
        category: 'executive',
        location: '大会議室A',
        roomId: meetingRooms[0].id,
        scheduledStartAt: new Date('2024-07-16T09:00:00Z'),
        scheduledEndAt: new Date('2024-07-16T12:00:00Z'),
        status: 'scheduled',
        agenda: JSON.stringify([
          '四半期業績レビュー',
          '各部門の成果報告',
          '次期戦略の検討',
          '予算配分の決定'
        ]),
        objectives: JSON.stringify([
          '四半期目標達成状況の確認',
          '戦略的意思決定',
          '来期計画の策定'
        ]),
        expectedRevenue: 50000000,
        priority: 'critical',
        tags: '経営,四半期,戦略'
      }
    })
  ]);

  // Create meeting participants
  const participants = await Promise.all([
    // 週次技術レビューの参加者
    prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[0].id,
        userId: users[1].id,
        role: 'organizer',
        invitationStatus: 'accepted',
        attendanceStatus: 'attended',
        joinedAt: new Date('2024-07-15T10:05:00Z'),
        leftAt: new Date('2024-07-15T11:10:00Z'),
        isRequired: true
      }
    }),
    prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[0].id,
        userId: users[2].id,
        role: 'participant',
        invitationStatus: 'accepted',
        attendanceStatus: 'attended',
        joinedAt: new Date('2024-07-15T10:05:00Z'),
        leftAt: new Date('2024-07-15T11:10:00Z'),
        isRequired: true
      }
    }),
    // 月次営業会議の参加者
    prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[1].id,
        userId: users[3].id,
        role: 'organizer',
        invitationStatus: 'accepted',
        attendanceStatus: 'pending',
        isRequired: true
      }
    }),
    prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[1].id,
        userId: users[0].id,
        role: 'participant',
        invitationStatus: 'accepted',
        attendanceStatus: 'pending',
        isRequired: false
      }
    }),
    // 四半期経営会議の参加者
    prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[2].id,
        userId: users[0].id,
        role: 'organizer',
        invitationStatus: 'accepted',
        attendanceStatus: 'pending',
        isRequired: true
      }
    }),
    prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[2].id,
        userId: users[1].id,
        role: 'participant',
        invitationStatus: 'accepted',
        attendanceStatus: 'pending',
        isRequired: true
      }
    }),
    prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[2].id,
        userId: users[3].id,
        role: 'participant',
        invitationStatus: 'accepted',
        attendanceStatus: 'pending',
        isRequired: true
      }
    }),
    prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[2].id,
        userId: users[4].id,
        role: 'participant',
        invitationStatus: 'accepted',
        attendanceStatus: 'pending',
        isRequired: true
      }
    })
  ]);

  // Create meeting cost for completed meeting
  const meetingCost = await prisma.meetingCost.create({
    data: {
      meetingId: meetings[0].id,
      totalCost: 26000,
      directCost: 14040,
      indirectCost: 2000,
      opportunityCost: 0,
      participantCount: 2,
      actualDurationMinutes: 65,
      scheduledDurationMinutes: 60,
      averageHourlyRate: 6500,
      costPerMinute: 400,
      efficiencyScore: 0.85,
      roiPercentage: 15.5,
      costBreakdown: JSON.stringify({
        personnel: 14040,
        room: 2000,
        equipment: 0,
        other: 0
      })
    }
  });

  // Create meeting analytics for completed meeting
  const meetingAnalytics = await prisma.meetingAnalytics.create({
    data: {
      meetingId: meetings[0].id,
      organizationId: organization.id,
      departmentId: departments[0].id,
      meetingDate: new Date('2024-07-15'),
      meetingHour: 10,
      dayOfWeek: 1,
      month: 7,
      quarter: 3,
      year: 2024,
      totalCost: 26000,
      costPerParticipant: 13000,
      costPerMinute: 400,
      scheduledDuration: 60,
      actualDuration: 65,
      preparationTime: 15,
      followUpTime: 30,
      startDelayMinutes: 5,
      efficiencyScore: 0.85,
      productivityScore: 0.90,
      decisionCount: 3,
      invitedCount: 2,
      attendedCount: 2,
      attendanceRate: 1.0,
      lateArrivals: 0,
      earlyDepartures: 0,
      roiPercentage: 15.5,
      costBenefitRatio: 1.15,
      satisfactionScore: 4.2,
      outcomeAchievementRate: 0.85
    }
  });

  console.log('✅ Database seed completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - 1 organization: ${organization.name}`);
  console.log(`   - ${departments.length} departments`);
  console.log(`   - ${roles.length} roles`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${meetingRooms.length} meeting rooms`);
  console.log(`   - ${meetings.length} meetings`);
  console.log(`   - ${participants.length} meeting participants`);
  console.log(`   - 1 cost template with ${costRates.length} cost rates`);
  console.log(`   - 1 meeting cost calculation`);
  console.log(`   - 1 meeting analytics record`);
  console.log('');
  console.log('🔑 Demo login credentials:');
  console.log('   CEO: ceo@demo.com / password123');
  console.log('   Tech Manager: tech-manager@demo.com / password123');
  console.log('   Senior Dev: senior-dev@demo.com / password123');
  console.log('   Sales Manager: sales-manager@demo.com / password123');
  console.log('   HR Manager: hr-manager@demo.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
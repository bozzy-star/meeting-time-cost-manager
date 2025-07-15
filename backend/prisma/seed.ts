import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create sample organization
  const organization = await prisma.organization.create({
    data: {
      name: 'サンプル株式会社',
      slug: 'sample-corp',
      domain: 'sample-corp.com',
      industry: 'IT・ソフトウェア',
      employeeCount: 250,
      timezone: 'Asia/Tokyo',
      currency: 'JPY',
      fiscalYearStart: new Date('2024-04-01'),
      settings: {
        workingHours: { start: '09:00', end: '18:00' },
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        overtime: {
          enabled: true,
          multiplier: 1.25
        }
      },
      subscriptionPlan: 'enterprise'
    }
  });

  console.log('✅ Created organization:', organization.name);

  // 2. Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        organizationId: organization.id,
        name: '経営企画部',
        code: 'STRATEGY',
        description: '経営戦略・企画を担当',
        costCenter: 'CC-001',
        budgetAnnual: 500000000 // 5億円
      }
    }),
    prisma.department.create({
      data: {
        organizationId: organization.id,
        name: '開発部',
        code: 'DEV',
        description: 'ソフトウェア開発を担当',
        costCenter: 'CC-002',
        budgetAnnual: 800000000 // 8億円
      }
    }),
    prisma.department.create({
      data: {
        organizationId: organization.id,
        name: '営業部',
        code: 'SALES',
        description: '営業活動を担当',
        costCenter: 'CC-003',
        budgetAnnual: 300000000 // 3億円
      }
    }),
    prisma.department.create({
      data: {
        organizationId: organization.id,
        name: '人事部',
        code: 'HR',
        description: '人事・総務を担当',
        costCenter: 'CC-004',
        budgetAnnual: 200000000 // 2億円
      }
    })
  ]);

  console.log('✅ Created departments:', departments.length);

  // 3. Create roles with hierarchy
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: '代表取締役CEO',
        level: 1,
        grade: 'E1',
        description: '最高経営責任者',
        defaultHourlyRate: 50000,
        permissions: {
          admin: true,
          analytics: { read: true, write: true },
          meetings: { read: true, write: true, delete: true },
          users: { read: true, write: true, delete: true }
        }
      }
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: '取締役',
        level: 2,
        grade: 'E2',
        description: '取締役',
        defaultHourlyRate: 30000,
        permissions: {
          analytics: { read: true, write: true },
          meetings: { read: true, write: true },
          users: { read: true, write: false }
        }
      }
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: '部長',
        level: 3,
        grade: 'M1',
        description: '部門責任者',
        defaultHourlyRate: 12000,
        permissions: {
          analytics: { read: true, write: false },
          meetings: { read: true, write: true },
          users: { read: true, write: false }
        }
      }
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: '課長',
        level: 4,
        grade: 'M2',
        description: '課責任者',
        defaultHourlyRate: 8000,
        permissions: {
          analytics: { read: true, write: false },
          meetings: { read: true, write: true }
        }
      }
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: '主任',
        level: 5,
        grade: 'S1',
        description: 'チームリーダー',
        defaultHourlyRate: 6000,
        permissions: {
          meetings: { read: true, write: true }
        }
      }
    }),
    prisma.role.create({
      data: {
        organizationId: organization.id,
        name: '一般社員',
        level: 6,
        grade: 'J1',
        description: '一般従業員',
        defaultHourlyRate: 4000,
        permissions: {
          meetings: { read: true, write: false }
        }
      }
    })
  ]);

  console.log('✅ Created roles:', roles.length);

  // 4. Create cost template
  const costTemplate = await prisma.costTemplate.create({
    data: {
      organizationId: organization.id,
      name: '標準コストテンプレート',
      description: '基本的な時給計算テンプレート',
      currency: 'JPY',
      overtimeMultiplier: 1.25,
      holidayMultiplier: 1.5,
      nightShiftMultiplier: 1.2,
      isDefault: true
    }
  });

  // 5. Create cost rates for each role
  const costRates = await Promise.all(
    roles.map(role => 
      prisma.costRate.create({
        data: {
          costTemplateId: costTemplate.id,
          roleId: role.id,
          baseHourlyRate: role.defaultHourlyRate!,
          effectiveFrom: new Date('2024-01-01'),
          rateType: 'standard'
        }
      })
    )
  );

  console.log('✅ Created cost rates:', costRates.length);

  // 6. Create sample users
  const passwordHash = await hash('Password123!', 12);

  const users = await Promise.all([
    // CEO
    prisma.user.create({
      data: {
        organizationId: organization.id,
        departmentId: departments[0].id, // 経営企画部
        roleId: roles[0].id, // CEO
        employeeId: 'EMP001',
        email: 'ceo@sample-corp.com',
        passwordHash,
        firstName: '太郎',
        lastName: '田中',
        displayName: '田中 太郎',
        phone: '090-1234-5678',
        hourlyRate: 50000,
        monthlySalary: 2000000,
        employmentType: 'full_time',
        hiredAt: new Date('2020-01-01'),
        status: 'active',
        emailVerifiedAt: new Date()
      }
    }),
    // 取締役
    prisma.user.create({
      data: {
        organizationId: organization.id,
        departmentId: departments[1].id, // 開発部
        roleId: roles[1].id, // 取締役
        employeeId: 'EMP002',
        email: 'cto@sample-corp.com',
        passwordHash,
        firstName: '花子',
        lastName: '鈴木',
        displayName: '鈴木 花子',
        phone: '090-2345-6789',
        hourlyRate: 30000,
        monthlySalary: 1500000,
        employmentType: 'full_time',
        hiredAt: new Date('2020-03-01'),
        status: 'active',
        emailVerifiedAt: new Date()
      }
    }),
    // 部長
    prisma.user.create({
      data: {
        organizationId: organization.id,
        departmentId: departments[1].id, // 開発部
        roleId: roles[2].id, // 部長
        employeeId: 'EMP003',
        email: 'dev-manager@sample-corp.com',
        passwordHash,
        firstName: '次郎',
        lastName: '佐藤',
        displayName: '佐藤 次郎',
        phone: '090-3456-7890',
        hourlyRate: 12000,
        monthlySalary: 800000,
        employmentType: 'full_time',
        hiredAt: new Date('2021-01-01'),
        status: 'active',
        emailVerifiedAt: new Date()
      }
    }),
    // 課長
    prisma.user.create({
      data: {
        organizationId: organization.id,
        departmentId: departments[2].id, // 営業部
        roleId: roles[3].id, // 課長
        employeeId: 'EMP004',
        email: 'sales-manager@sample-corp.com',
        passwordHash,
        firstName: '美香',
        lastName: '高橋',
        displayName: '高橋 美香',
        phone: '090-4567-8901',
        hourlyRate: 8000,
        monthlySalary: 600000,
        employmentType: 'full_time',
        hiredAt: new Date('2021-06-01'),
        status: 'active',
        emailVerifiedAt: new Date()
      }
    }),
    // 一般社員（複数）
    ...Array.from({ length: 6 }, (_, i) => 
      prisma.user.create({
        data: {
          organizationId: organization.id,
          departmentId: departments[i % 4].id,
          roleId: roles[5].id, // 一般社員
          employeeId: `EMP${String(i + 10).padStart(3, '0')}`,
          email: `employee${i + 1}@sample-corp.com`,
          passwordHash,
          firstName: ['三郎', '四郎', '五郎', '六郎', '七郎', '八郎'][i],
          lastName: ['田中', '鈴木', '佐藤', '高橋', '伊藤', '渡辺'][i],
          displayName: `${['田中', '鈴木', '佐藤', '高橋', '伊藤', '渡辺'][i]} ${['三郎', '四郎', '五郎', '六郎', '七郎', '八郎'][i]}`,
          phone: `090-${5000 + i}${String(i).repeat(3)}`,
          hourlyRate: 4000,
          monthlySalary: 350000,
          employmentType: 'full_time',
          hiredAt: new Date(`2022-${String((i % 12) + 1).padStart(2, '0')}-01`),
          status: 'active',
          emailVerifiedAt: new Date()
        }
      })
    )
  ]);

  console.log('✅ Created users:', users.length);

  // 7. Update department managers
  await Promise.all([
    prisma.department.update({
      where: { id: departments[0].id },
      data: { managerId: users[0].id } // CEO
    }),
    prisma.department.update({
      where: { id: departments[1].id },
      data: { managerId: users[2].id } // 開発部長
    }),
    prisma.department.update({
      where: { id: departments[2].id },
      data: { managerId: users[3].id } // 営業課長
    }),
    prisma.department.update({
      where: { id: departments[3].id },
      data: { managerId: users[1].id } // 取締役が人事部も兼任
    })
  ]);

  // 8. Create meeting rooms
  const meetingRooms = await Promise.all([
    prisma.meetingRoom.create({
      data: {
        organizationId: organization.id,
        name: '大会議室A',
        location: '本社10F',
        capacity: 20,
        hourlyCost: 5000,
        equipment: {
          projector: true,
          whiteboard: true,
          videoConference: true,
          wifi: true
        }
      }
    }),
    prisma.meetingRoom.create({
      data: {
        organizationId: organization.id,
        name: '中会議室B',
        location: '本社10F',
        capacity: 10,
        hourlyCost: 3000,
        equipment: {
          projector: true,
          whiteboard: true,
          videoConference: false,
          wifi: true
        }
      }
    }),
    prisma.meetingRoom.create({
      data: {
        organizationId: organization.id,
        name: '小会議室C',
        location: '本社9F',
        capacity: 6,
        hourlyCost: 2000,
        equipment: {
          projector: false,
          whiteboard: true,
          videoConference: false,
          wifi: true
        }
      }
    })
  ]);

  console.log('✅ Created meeting rooms:', meetingRooms.length);

  // 9. Create sample meetings
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const meetings = await Promise.all([
    // 昨日の完了した会議
    prisma.meeting.create({
      data: {
        organizationId: organization.id,
        organizerId: users[0].id, // CEO
        title: '四半期業績レビュー会議',
        description: 'Q4の業績レビューと来期戦略の検討',
        meetingType: 'board',
        category: '経営会議',
        location: '大会議室A',
        roomId: meetingRooms[0].id,
        isOnline: false,
        scheduledStartAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000), // 9:00
        scheduledEndAt: new Date(yesterday.getTime() + 11 * 60 * 60 * 1000), // 11:00
        actualStartAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 + 5 * 60 * 1000), // 9:05 (5分遅れ)
        actualEndAt: new Date(yesterday.getTime() + 11 * 60 * 60 * 1000 + 15 * 60 * 1000), // 11:15 (15分延長)
        status: 'completed',
        agenda: '1. Q4実績報告\n2. 来期予算計画\n3. 新規事業検討',
        objectives: {
          primary: '来期戦略の決定',
          secondary: '予算承認'
        },
        expectedOutcomes: '来期予算と戦略の確定',
        expectedRevenue: 500000000, // 5億円
        priority: 'high',
        tags: ['戦略', '予算', '業績']
      }
    }),
    // 今日の進行中会議
    prisma.meeting.create({
      data: {
        organizationId: organization.id,
        organizerId: users[2].id, // 開発部長
        title: '週次開発進捗会議',
        description: '開発プロジェクトの進捗確認',
        meetingType: 'regular',
        category: '開発会議',
        isOnline: true,
        meetingUrl: 'https://zoom.us/j/123456789',
        scheduledStartAt: new Date(now.getTime() - 30 * 60 * 1000), // 30分前開始
        scheduledEndAt: new Date(now.getTime() + 30 * 60 * 1000), // 30分後終了予定
        actualStartAt: new Date(now.getTime() - 30 * 60 * 1000),
        status: 'in_progress',
        agenda: '1. スプリント進捗報告\n2. ブロッカー確認\n3. 来週のタスク計画',
        objectives: {
          primary: '進捗の共有と課題解決'
        },
        expectedRevenue: 10000000, // 1000万円
        priority: 'medium',
        tags: ['開発', '進捗', 'スプリント']
      }
    }),
    // 明日の予定会議
    prisma.meeting.create({
      data: {
        organizationId: organization.id,
        organizerId: users[3].id, // 営業課長
        title: '月次営業会議',
        description: '月次売上報告と来月の目標設定',
        meetingType: 'regular',
        category: '営業会議',
        location: '中会議室B',
        roomId: meetingRooms[1].id,
        isOnline: false,
        scheduledStartAt: new Date(tomorrow.getTime() + 14 * 60 * 60 * 1000), // 14:00
        scheduledEndAt: new Date(tomorrow.getTime() + 16 * 60 * 60 * 1000), // 16:00
        status: 'scheduled',
        agenda: '1. 月次実績報告\n2. 顧客分析\n3. 来月目標設定',
        objectives: {
          primary: '来月の営業目標設定',
          secondary: '顧客戦略の検討'
        },
        expectedRevenue: 100000000, // 1億円
        priority: 'high',
        tags: ['営業', '実績', '目標']
      }
    })
  ]);

  console.log('✅ Created meetings:', meetings.length);

  // 10. Add meeting participants
  const meetingParticipants = [];
  
  // 四半期業績レビュー会議の参加者（役員会議）
  for (let i = 0; i < 4; i++) {
    const participant = await prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[0].id,
        userId: users[i].id,
        role: i === 0 ? 'organizer' : 'participant',
        invitationStatus: 'accepted',
        attendanceStatus: 'present',
        joinedAt: meetings[0].actualStartAt,
        leftAt: meetings[0].actualEndAt,
        isRequired: true
      }
    });
    meetingParticipants.push(participant);
  }

  // 週次開発進捗会議の参加者
  for (let i = 2; i < 8; i++) {
    const participant = await prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[1].id,
        userId: users[i].id,
        role: i === 2 ? 'organizer' : 'participant',
        invitationStatus: 'accepted',
        attendanceStatus: i < 6 ? 'present' : 'absent',
        joinedAt: i < 6 ? meetings[1].actualStartAt : null,
        isRequired: true
      }
    });
    meetingParticipants.push(participant);
  }

  // 月次営業会議の参加者
  for (let i = 3; i < 7; i++) {
    const participant = await prisma.meetingParticipant.create({
      data: {
        meetingId: meetings[2].id,
        userId: users[i].id,
        role: i === 3 ? 'organizer' : 'participant',
        invitationStatus: i < 6 ? 'accepted' : 'pending',
        attendanceStatus: 'unknown',
        isRequired: true
      }
    });
    meetingParticipants.push(participant);
  }

  console.log('✅ Created meeting participants:', meetingParticipants.length);

  // 11. Create meeting costs for completed meetings
  const meetingCost = await prisma.meetingCost.create({
    data: {
      meetingId: meetings[0].id, // 四半期業績レビュー会議
      totalCost: 425000, // 4人 × 平均35000円/時 × 2.25時間
      directCost: 315000, // 人件費
      indirectCost: 60000, // 会議室代、準備時間等
      opportunityCost: 50000, // 機会損失
      participantCount: 4,
      actualDurationMinutes: 135, // 2時間15分
      scheduledDurationMinutes: 120, // 2時間
      averageHourlyRate: 35000,
      costPerMinute: 3148,
      efficiencyScore: 0.85,
      roiPercentage: 11664.71, // (500M - 425K) / 425K * 100
      costBreakdown: {
        ceo: { hourlyRate: 50000, duration: 135, cost: 112500 },
        cto: { hourlyRate: 30000, duration: 135, cost: 67500 },
        manager1: { hourlyRate: 12000, duration: 135, cost: 27000 },
        manager2: { hourlyRate: 8000, duration: 135, cost: 18000 },
        roomCost: 11250,
        facilitationCost: 5000
      }
    }
  });

  // 12. Create meeting analytics
  const meetingAnalytics = await prisma.meetingAnalytics.create({
    data: {
      meetingId: meetings[0].id,
      organizationId: organization.id,
      departmentId: departments[0].id,
      meetingDate: yesterday,
      meetingHour: 9,
      dayOfWeek: yesterday.getDay() || 7, // Sunday = 7
      month: yesterday.getMonth() + 1,
      quarter: Math.ceil((yesterday.getMonth() + 1) / 3),
      year: yesterday.getFullYear(),
      totalCost: 425000,
      costPerParticipant: 106250,
      costPerMinute: 3148,
      scheduledDuration: 120,
      actualDuration: 135,
      preparationTime: 30,
      followUpTime: 15,
      startDelayMinutes: 5,
      efficiencyScore: 0.85,
      productivityScore: 0.90,
      decisionCount: 3,
      invitedCount: 4,
      attendedCount: 4,
      attendanceRate: 1.0,
      lateArrivals: 0,
      earlyDepartures: 0,
      expectedRevenue: 500000000,
      roiPercentage: 11664.71,
      costBenefitRatio: 0.000085,
      satisfactionScore: 0.85,
      outcomeAchievementRate: 0.90
    }
  });

  // 13. Create organization metrics
  const orgMetrics = await prisma.organizationMetrics.create({
    data: {
      organizationId: organization.id,
      metricDate: yesterday,
      metricType: 'daily',
      totalMeetings: 1,
      totalMeetingHours: 2.25,
      averageMeetingDuration: 135,
      totalMeetingCost: 425000,
      averageMeetingCost: 425000,
      costPerEmployee: 1700, // 425000 / 250 employees
      costTrendPercentage: 5.2,
      overallEfficiencyScore: 0.85,
      onTimeStartRate: 0.0, // 遅れて開始
      meetingUtilizationRate: 1.125, // 実際時間 / 予定時間
      totalExpectedRevenue: 500000000,
      averageRoi: 11664.71,
      profitableMeetingsPercentage: 1.0,
      industryComparison: {
        efficiency: { industry: 0.75, company: 0.85 },
        cost: { industry: 500000, company: 425000 }
      },
      sizeComparison: {
        similar_size_avg_cost: 450000,
        similar_size_avg_efficiency: 0.80
      }
    }
  });

  console.log('✅ Created analytics data');

  console.log('🌱 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Organizations: 1`);
  console.log(`- Departments: ${departments.length}`);
  console.log(`- Roles: ${roles.length}`);
  console.log(`- Users: ${users.length}`);
  console.log(`- Meeting Rooms: ${meetingRooms.length}`);
  console.log(`- Meetings: ${meetings.length}`);
  console.log(`- Meeting Participants: ${meetingParticipants.length}`);
  console.log(`- Cost Templates: 1`);
  console.log(`- Cost Rates: ${costRates.length}`);
  
  console.log('\n🔑 Test Accounts:');
  console.log('CEO: ceo@sample-corp.com / Password123!');
  console.log('CTO: cto@sample-corp.com / Password123!');
  console.log('Dev Manager: dev-manager@sample-corp.com / Password123!');
  console.log('Sales Manager: sales-manager@sample-corp.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
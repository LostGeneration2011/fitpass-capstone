import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.attendance.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create 1 Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fitpass.com',
      password: hashedPassword,
      fullName: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  // Create 2 Teachers
  const teacher1 = await prisma.user.create({
    data: {
      email: 'teacher1@fitpass.com',
      password: hashedPassword,
      fullName: 'Nguyễn Văn Giáo',
      role: UserRole.TEACHER,
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      email: 'teacher2@fitpass.com',
      password: hashedPassword,
      fullName: 'Trần Thị Hương',
      role: UserRole.TEACHER,
    },
  });

  // Create 5 Students
  const students = [];
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i}@fitpass.com`,
        password: hashedPassword,
        fullName: `Học viên ${i}`,
        role: UserRole.STUDENT,
      },
    });
    students.push(student);
  }

  // Create some classes
  const class1 = await prisma.class.create({
    data: {
      name: 'Yoga Cơ Bản',
      description: 'Lớp yoga dành cho người mới bắt đầu',
      capacity: 20,
      duration: 90,
      teacherId: teacher1.id,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: 'Gym Nâng Cao',
      description: 'Lớp gym dành cho người có kinh nghiệm',
      capacity: 15,
      duration: 120,
      teacherId: teacher2.id,
    },
  });

  // Create enrollments
  for (const student of students.slice(0, 3)) {
    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        classId: class1.id,
      },
    });
  }

  for (const student of students.slice(2, 5)) {
    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        classId: class2.id,
      },
    });
  }

  // Create sessions
  const now = new Date();
  const session1 = await prisma.session.create({
    data: {
      classId: class1.id,
      startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // tomorrow
      endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // +90 min
      status: 'UPCOMING',
    },
  });

  const session2 = await prisma.session.create({
    data: {
      classId: class2.id,
      startTime: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
      endTime: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour from now
      status: 'ACTIVE',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Created:`);
  console.log(`- 1 Admin: ${admin.email}`);
  console.log(`- 2 Teachers: ${teacher1.email}, ${teacher2.email}`);
  console.log(`- 5 Students: ${students.map(s => s.email).join(', ')}`);
  console.log(`- 2 Classes: ${class1.name}, ${class2.name}`);
  console.log(`- Default password for all users: password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

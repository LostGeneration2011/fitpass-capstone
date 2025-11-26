import { prisma } from './src/config/prisma';

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test 1: Connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test 2: Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@fitpass.com',
        name: 'Test User',
        password: 'test123',
        role: 'STUDENT'
      }
    });
    console.log('✅ Test user created:', testUser);
    
    // Test 3: Read all users
    const users = await prisma.user.findMany();
    console.log('✅ All users:', users);
    
    // Test 4: Delete test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Test user deleted');
    
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
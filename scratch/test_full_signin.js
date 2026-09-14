import { AuthService } from '../src/services/authService.ts';

async function testAdminSignIn() {
  const email = 'zuneydkhan04477@gmail.com';
  console.log(`Testing AuthService.signIn for ${email}...`);

  const res = await AuthService.signIn(email, 'admin123', 'admin');
  console.log('signIn result:', JSON.stringify(res, null, 2));
}

testAdminSignIn().catch(console.error);

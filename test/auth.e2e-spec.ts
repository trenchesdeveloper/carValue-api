import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'asdf@asdf.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdfgh' })
      .expect(201)
      .then(async (res) => {
        const { id, email } = res.body;
        expect(email).toEqual(email)
        expect(id).toBeDefined();
      });
  });

  it('signup as a new user then get the currently logged in user', async() => {
    const email = 'asdf@asddf.com';
     const res = await request(app.getHttpServer())
       .post('/auth/signup')
       .send({ email, password: 'asdfgh' })
       .expect(201)


       const cookie = res.get('Set-Cookie')

     const {body} =  await request(app.getHttpServer())
       .get('/auth/whoami')
       .set('Cookie', cookie)
       .expect(200)

       expect(body.email).toEqual(email);
  })
});

require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    // test GET types w/ joins

    test('returns all types', async() => {

      const expectation = [
        {
          id: expect.any(Number),
          type: 'Road'
        },
        {
          id: expect.any(Number),
          type: 'Mountain'
        },
        {
          id: expect.any(Number),
          type: 'Cruiser'
        },
        {
          id: expect.any(Number),
          type: 'Folding'
        },
        {
          id: expect.any(Number),
          type: 'Cargo'
        }
      ];

      const data = await fakeRequest(app)
        .get('/karlsbikes/types')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // test GET all bikes w/ joins - FAILING!
    test('returns karlsbikes', async() => {

      const expectation = [
        {
          'id': expect.any(Number),
          'year': expect.any(Number),
          'make': expect.any(String),
          'model': expect.any(String),
          'color': expect.any(String),
          'img': expect.any(String),
          'rideable': expect.any(Boolean),
          'owner_id': 1,
          'type': expect.any(String),
          'type_id': expect.any(Number)
        },
        {
          'id': expect.any(Number),
          'year': expect.any(Number),
          'make': expect.any(String),
          'model': expect.any(String),
          'color': expect.any(String),
          'img': expect.any(String),
          'rideable': expect.any(Boolean),
          'owner_id': 1,
          'type': expect.any(String),
          'type_id': expect.any(Number)
        },
        {
          'id': expect.any(Number),
          'year': expect.any(Number),
          'make': expect.any(String),
          'model': expect.any(String),
          'color': expect.any(String),
          'img': expect.any(String),
          'rideable': expect.any(Boolean),
          'owner_id': 1,
          'type': expect.any(String),
          'type_id': expect.any(Number)
        },
        {
          'id': expect.any(Number),
          'year': expect.any(Number),
          'make': expect.any(String),
          'model': expect.any(String),
          'color': expect.any(String),
          'img': expect.any(String),
          'rideable': expect.any(Boolean),
          'owner_id': 1,
          'type': expect.any(String),
          'type_id': expect.any(Number)
        },
        {
          'id': expect.any(Number),
          'year': expect.any(Number),
          'make': expect.any(String),
          'model': expect.any(String),
          'color': expect.any(String),
          'img': expect.any(String),
          'rideable': expect.any(Boolean),
          'owner_id': 1,
          'type': expect.any(String),
          'type_id': expect.any(Number)
        },
        {
          'id': expect.any(Number),
          'year': expect.any(Number),
          'make': expect.any(String),
          'model': expect.any(String),
          'color': expect.any(String),
          'img': expect.any(String),
          'rideable': expect.any(Boolean),
          'owner_id': 1,
          'type': expect.any(String),
          'type_id': expect.any(Number)
        },
        {
          'id': expect.any(Number),
          'year': expect.any(Number),
          'make': expect.any(String),
          'model': expect.any(String),
          'color': expect.any(String),
          'img': expect.any(String),
          'rideable': expect.any(Boolean),
          'owner_id': 1,
          'type': expect.any(String),
          'type_id': expect.any(Number)
        }
      ];

      const data = await fakeRequest(app)
        .get('/karlsbikes')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // test GET single bike w/ joins
    test('returns karlsbikes/id', async() => {

      const expectation = 
      {
        'id': 6,
        'year': expect.any(Number),
        'make': expect.any(String),
        'model': expect.any(String),
        'color': expect.any(String),
        'img': expect.any(String),
        'rideable': expect.any(Boolean),
        'owner_id': 1,
        'type': expect.any(String),
        'type_id': expect.any(Number)
      };

      const data = await fakeRequest(app)
        .get('/karlsbikes/6')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // test POST with category_id
    test('returns new post', async() => {

      const expectation = 
        {
          owner_id: expect.any(Number),
          id: expect.any(Number),
          year: 2055,
          make: 'Overlord',
          model: 'Only One',
          color: 'Soylent',
          type_id: 3,
          img: 'https://www.yankodesign.com/images/design_news/2018/01/furia/furia_01.jpg',
          rideable: true
        };

      const data = await fakeRequest(app)
        .post('/karlsbikes/') 
        .send({
          year: 2055,
          make: 'Overlord',
          model: 'Only One',
          color: 'Soylent',
          type_id: 3,
          img: 'https://www.yankodesign.com/images/design_news/2018/01/furia/furia_01.jpg',
          rideable: true
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('returns changed post', async() => {

      const expectation = 
        {
          owner_id: expect.any(Number),
          id: expect.any(Number),
          year: 2007,
          make: 'Trek',
          model: '1600 WSD',
          color: 'Blue',
          type_id: 1,
          type: 'Road',
          img: 'https://archive.trekbikes.com/images/bikes/2007/large/1600wsd_mineralblue.jpg',
          rideable: false
        };

      await fakeRequest(app)
        .put('/karlsbikes/1') 
        .send({
          year: 2007,
          make: 'Trek',
          model: '1600 WSD',
          color: 'Blue',
          type_id: 1,
          img: 'https://archive.trekbikes.com/images/bikes/2007/large/1600wsd_mineralblue.jpg',
          rideable: false
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const realActual = await fakeRequest(app)
        .get('/karlsbikes/1') 
        .expect('Content-Type', /json/)
        .expect(200);

      expect(realActual.body).toEqual(expectation);
    });

    test('deletes post', async() => {
      const expectation = 
        {
          id: 2,
          owner_id: 1,
          year: 2006,
          make: 'Fuji',
          model: 'Absolute 3.0',
          color: 'Black',
          type_id: 1,
          img: 'https://www.insideasi.com/downloads/bikes/Fuji/2006/absolute-30/absolute-30-lowres.jpg',
          rideable: true
        };
      const data = await fakeRequest(app)
        .delete('/karlsbikes/2') 
        .expect('Content-Type', /json/)
        .expect(200);

      const deletedEntry = await fakeRequest(app)
        .get('/karlsbikes/2') 
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
      expect(deletedEntry.body).toEqual('');
    });
  });
});

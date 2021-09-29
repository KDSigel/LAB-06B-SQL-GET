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

    test('returns karlsbikes', async() => {

      const expectation = [
        {
          id: 1,
          owner_id: 1,
          year: 2007,
          make: 'Trek',
          model: '1600 WSD',
          color: 'Mineral Blue',
          type: 'Road',
          img: 'https://archive.trekbikes.com/images/bikes/2007/large/1600wsd_mineralblue.jpg',
          rideable: false
        },
        {
          id: 2,
          owner_id: 1,
          year: 2006,
          make: 'Fuji',
          model: 'Absolute 3.0',
          color: 'Black',
          type: 'Road',
          img: 'https://www.insideasi.com/downloads/bikes/Fuji/2006/absolute-30/absolute-30-lowres.jpg',
          rideable: true
        },
        {
          id: 3,
          owner_id: 1,
          year: 1976,
          make: 'Sekai',
          model: '2500 Grand Tour',
          color: 'Black (now white)',
          type: 'Road',
          img: 'https://1.bp.blogspot.com/-UQOVL6nUhck/W6pf97lsptI/AAAAAAAArwk/bGDKwHufUV8lBOIGrEFRGxDxcy3rW7FLQCLcBGAs/s1600/Gary%2BFisher%2BReview.jpg',
          rideable: false
        },
        {
          id: 4,
          owner_id: 1,
          year: 2004,
          make: 'Cannondale',
          model: 'F800 Furio',
          color: 'Blue w/ flames',
          type: 'Mountain',
          img: 'https://figinibike.com/wp-content/uploads/2018/03/37-F800-ALL-MOUNTAIN-FURIO-750.jpg',
          rideable: false
        },
        {
          id: 5,
          owner_id: 1,
          year: 1988,
          make: 'Apollo',
          model: 'Everest',
          color: 'Yellow (now black)',
          type: 'Mountain',
          img: 'https://digitalhippie.net/wp-content/uploads/2011/05/1988-mtb-tour-ernst-apollo3.jpg',
          rideable: false
        },
        {
          id: 6,
          owner_id: 1,
          year: 2005,
          make: 'Electra',
          model: 'Townie',
          color: 'Silver',
          type: 'Cruiser',
          img: 'https://m.media-amazon.com/images/I/71jUDoq5XRL._AC_SL1465_.jpg',
          rideable: false
        },
        {
          id: 7,
          owner_id: 1,
          year: 2000,
          make: 'San Eagle',
          model: '?',
          color: 'Blue',
          type: 'Folding',
          img: 'https://3.bp.blogspot.com/-cgr3v3ZzHQM/UilJMLMYphI/AAAAAAAADOI/zeN2DDCwCu0/s1600/2028-blue+2.JPG',
          rideable: true
        }
      ];

      const data = await fakeRequest(app)
        .get('/karlsbikes')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns karlsbikes/id', async() => {

      const expectation = 
        {
          id: 6,
          owner_id: 1,
          year: 2005,
          make: 'Electra',
          model: 'Townie',
          color: 'Silver',
          type: 'Cruiser',
          img: 'https://m.media-amazon.com/images/I/71jUDoq5XRL._AC_SL1465_.jpg',
          rideable: false
        };

      const data = await fakeRequest(app)
        .get('/karlsbikes/6')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});

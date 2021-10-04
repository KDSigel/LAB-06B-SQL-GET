const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const karlsbikes = require('./karlsbikes.js');
const types = require('./types.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        const hash = bcrypt.hashSync(user.password, 8);
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, hash]);
      })
    );
      
    const user = users[0].rows[0];


    await Promise.all(
      types.map(type => {
        return client.query(`
                    INSERT INTO types (type)
                    VALUES ($1);
                `,
        [type.type]);
      })
    );

    await Promise.all(
      karlsbikes.map(bikes => {
        return client.query(`
                    INSERT INTO karlsbikes (year, make, model, color, img, rideable, owner_id, type_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                `,
        [bikes.year, bikes.make, bikes.model, bikes.color, bikes.img, bikes.rideable, user.id, bikes.type_id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}

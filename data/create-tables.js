const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );
                CREATE TABLE types (
                  id SERIAL PRIMARY KEY,
                  type VARCHAR(512) NOT NULL
              );   
                CREATE TABLE karlsbikes (
                    id SERIAL PRIMARY KEY NOT NULL,
                    year INTEGER NOT NULL,
                    make VARCHAR(512) NOT NULL,
                    model VARCHAR(512) NOT NULL,
                    color VARCHAR(512) NOT NULL,
                    img VARCHAR(512) NOT NULL,
                    rideable BOOLEAN,
                    owner_id INTEGER NOT NULL REFERENCES users(id),
                    type_id INTEGER NOT NULL REFERENCES types(id)
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}

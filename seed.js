const { MongoClient } = require('mongodb');

const SOURCE_URI = 'mongodb+srv://samostafa963:zura2025@cluster0.utximqz.mongodb.net/ZAD_Database?appName=Cluster0';
const TARGET_URI = process.env.MONGO_URI || 'mongodb+srv://samostafa963:zura2025@cluster0.utximqz.mongodb.net/zura_web?appName=Cluster0';

const COLLECTIONS = ['products', 'categories', 'banners'];

async function seed() {
  console.log('TARGET_URI:', TARGET_URI);
  const source = new MongoClient(SOURCE_URI);
  const target = new MongoClient(TARGET_URI);
  try {
    await source.connect();
    await target.connect();
    console.log('Connected!');
    const sourceDb = source.db('ZAD_Database');
    // extract db name from URI
    const dbName = TARGET_URI.split('/').pop()?.split('?')[0] || 'zura_web';
    console.log('Target DB:', dbName);
    const targetDb = target.db(dbName);
    for (const col of COLLECTIONS) {
      const docs = await sourceDb.collection(col).find({}).toArray();
      await targetDb.collection(col).deleteMany({});
      if (docs.length > 0) await targetDb.collection(col).insertMany(docs);
      console.log(col + ': ' + docs.length);
    }
    console.log('Done!');
  } catch(e) { console.error(e.message); }
  finally { await source.close(); await target.close(); process.exit(0); }
}

seed();
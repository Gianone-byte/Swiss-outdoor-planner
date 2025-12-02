import { MongoClient, ObjectId } from 'mongodb';
import { MONGO_URI } from '$env/static/private';

const client = new MongoClient(MONGO_URI);
const dbName = 'swiss_outdoor_planner';

let clientPromise;

export async function getClient() {
	if (!clientPromise) {
		clientPromise = client.connect();
	}
	return clientPromise;
}

export async function getDb() {
	const client = await getClient();
	return client.db(dbName);
}

export { ObjectId };

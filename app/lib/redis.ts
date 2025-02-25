
import redis from 'redis';

const client = redis.createClient({
    url: 'redis://127.0.0.1:6379', // Adresse du serveur Redis
  });

await client.connect();
  
client.on('connect', () => {
    console.log('Connecté à Redis');
});

client.on('error', (err) => {
    console.error('Erreur de connexion à Redis :', err);
});



export default client;
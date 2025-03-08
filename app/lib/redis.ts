
import Redis from "ioredis"

const client = new Redis("rediss://default:AXLlAAIjcDFiZDc0ZjhmZWVmYmU0NzY3ODA4NDczOGUwMTUzMjNjOHAxMA@intimate-monarch-29413.upstash.io:6379");


  
client.on('connect', () => {
    console.log('Connecté à Redis');
});

client.on('error', (err) => {
    console.error('Erreur de connexion à Redis :', err);
});



export default client;
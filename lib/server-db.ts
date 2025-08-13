import { createClient, type Client } from '@libsql/client';
import { cookies } from 'next/headers';

let serverDbClient: Client | null = null;

export async function getServerDb(): Promise<Client | null> {
  const cookieStore = await cookies();
  const configCookie = cookieStore.get('db-config');
  
  if (!configCookie) return null;
  
  try {
    const config = JSON.parse(configCookie.value);
    
    if (!serverDbClient) {
      serverDbClient = createClient({
        url: `file:${config.databasePath}`,
        encryptionKey: config.encryptionKey,
      });
    }
    
    return serverDbClient;
  } catch (error) {
    console.error('Failed to create server database client:', error);
    return null;
  }
}
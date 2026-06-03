import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export class DatabaseService {
  private db: any;

  async init(): Promise<void> {
    this.db = await SQLite.openDatabase({
      name: 'datalake.db',
      location: 'default'
    });
    
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        timestamp TEXT,
        faceHash TEXT,
        livenessScore REAL,
        synced INTEGER DEFAULT 0
      )
    `);
  }

  async saveAttendance(userId: string, faceHash: string, livenessScore: number): Promise<number> {
    const timestamp = new Date().toISOString();
    const [result] = await this.db.executeSql(
      'INSERT INTO attendance (userId, timestamp, faceHash, livenessScore, synced) VALUES (?, ?, ?, ?, ?)',
      [userId, timestamp, faceHash, livenessScore, 0]
    );
    return result.insertId;
  }

  async getUnsyncedRecords(): Promise<any[]> {
    const [results] = await this.db.executeSql(
      'SELECT * FROM attendance WHERE synced = 0 ORDER BY id ASC'
    );
    const records = [];
    for (let i = 0; i < results.rows.length; i++) {
      records.push(results.rows.item(i));
    }
    return records;
  }

  async markSynced(ids: number[]): Promise<void> {
    const placeholders = ids.map(() => '?').join(',');
    await this.db.executeSql(
      `UPDATE attendance SET synced = 1 WHERE id IN (${placeholders})`,
      ids
    );
  }

  async purgeSynced(): Promise<void> {
    await this.db.executeSql('DELETE FROM attendance WHERE synced = 1');
  }
}

export default new DatabaseService();

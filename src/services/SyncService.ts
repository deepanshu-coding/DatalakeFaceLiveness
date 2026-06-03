import DatabaseService from './DatabaseService';

export class SyncService {
  private apiEndpoint: string = 'https://your-api.execute-api.us-east-1.amazonaws.com/prod/sync';

  async sync(): Promise<{ success: boolean; count: number }> {
    const isOnline = await this.checkConnectivity();
    if (!isOnline) {
      return { success: false, count: 0 };
    }

    const records = await DatabaseService.getUnsyncedRecords();
    if (records.length === 0) {
      return { success: true, count: 0 };
    }

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records, deviceId: await this.getDeviceId() })
      });

      if (response.ok) {
        const ids = records.map(r => r.id);
        await DatabaseService.markSynced(ids);
        await DatabaseService.purgeSynced();
        return { success: true, count: records.length };
      }
      return { success: false, count: 0 };
    } catch (error) {
      return { success: false, count: 0 };
    }
  }

  private async checkConnectivity(): Promise<boolean> {
    try {
      await fetch('https://www.google.com', { method: 'HEAD', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  private async getDeviceId(): Promise<string> {
    return 'device_' + Math.random().toString(36).substring(7);
  }
}

export default new SyncService();

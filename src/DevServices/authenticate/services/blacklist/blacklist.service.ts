import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistService {
  private blacklist: Set<string> = new Set();

  async addToBlacklist(token: string): Promise<void> {
    this.blacklist.add(token);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.blacklist.has(token);
  }

  async removeFromBlacklist(token: string): Promise<void> {
    this.blacklist.delete(token);
  }

  async getBlacklistedTokens(): Promise<string[]> {
    return Array.from(this.blacklist);
  }
}

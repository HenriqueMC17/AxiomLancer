import { IUserProfileRepository } from "@/core/domain/ports/repositories/user-profile.repository.port";
import { UserProfile } from "@/core/domain/types";
import { Database } from "@/lib/db";

export class InMemoryUserProfileRepository implements IUserProfileRepository {
  public async findByUserId(userId: string): Promise<UserProfile | null> {
    return Database.getProfile(userId);
  }

  public async update(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return Database.updateProfile(userId, data);
  }
}

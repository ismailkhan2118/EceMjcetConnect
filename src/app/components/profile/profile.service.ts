import { Injectable } from '@angular/core';
import { FirestoreService } from 'src/app/shared/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  userProfile: any;
  constructor(private fsService: FirestoreService) {
    this.fetchUserProfile();
  }

  createProfile(name: string, bio: string, gradYear: string, photoUrl: string) {
    return this.fsService.createProfile(name, bio, gradYear, photoUrl);
  }

  fetchUserProfile() {
    return this.fsService.fetchUserProfile();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastService } from '../toasts-container/toast.service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: any;
  mode = 'add';
  defaultName: string;
  photoUrl: string;
  isLoading = false;

  constructor(
    private formbuilder: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.defaultName = user?.name || '';
      this.photoUrl = user?.photoUrl || '';
    });

    this.isLoading = true;
    this.profileService.fetchUserProfile().subscribe(
      (data) => {
        this.isLoading = false;
        if (!data.exists) {
          this.userProfile = null;
          this.mode = 'add';
        } else {
          this.userProfile = data.data();
          this.mode = 'edit';
        }
        this.buildForm();
      },
      (err) => {
        this.isLoading = false;
        this.showErr();
      }
    );
  }

  buildForm() {
    this.profileForm = this.formbuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(4),
        ],
      ],
      bio: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(6),
        ],
      ],
      grad: ['', Validators.required],
    });
    if (this.mode === 'edit') {
      this.profileForm.patchValue({
        name: this.userProfile.name,
        bio: this.userProfile.bio,
        grad: this.userProfile.gradYear,
      });
    } else {
      this.profileForm.patchValue({
        name: this.defaultName,
      });
    }
  }

  get nameControl() {
    return this.profileForm.get('name');
  }
  get bioControl() {
    return this.profileForm.get('bio');
  }
  get gradControl() {
    return this.profileForm.get('grad');
  }
  get profileFormControl() {
    return this.profileForm;
  }

  onSubmit() {
    this.isLoading = true;
    this.profileService
      .createProfile(
        this.nameControl?.value,
        this.bioControl?.value,
        this.gradControl?.value,
        this.photoUrl
      )
      .subscribe(
        () => {
          this.isLoading = false;
          this.showSuccess();
          setTimeout(() => {
            this.router.navigate(['']);
          }, 2000);
        },
        (err) => {
          this.isLoading = false;
          this.showErr();
          setTimeout(() => {
            this.router.navigate(['']);
          }, 2000);
        }
      );
  }

  showSuccess() {
    this.toastService.show('Profile Updated Successfully!', {
      classname: 'bg-jet text-light',
      delay: 1500,
    });
  }

  showErr() {
    this.toastService.show('Error Updating Profile, Please try later!', {
      classname: 'bg-jet text-light',
      delay: 1500,
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(1)]],
      weight: ['', [Validators.required, Validators.min(1)]],
      goal: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // For simplicity, we'll assume a single user with ID 1.
    // In a real app, you would get the logged-in user's ID.
    this.loadUser(1);
  }

  loadUser(id: number): void {
    this.userService.getUser(id).subscribe(user => {
      this.user = user;
      this.profileForm.patchValue(user);
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedUser = { ...this.user, ...this.profileForm.value };
      if (this.user && this.user.id) {
        this.userService.updateUser(this.user.id, updatedUser).subscribe(() => {
          alert('Profile updated successfully!');
        });
      } else {
        this.userService.createUser(updatedUser).subscribe(() => {
          alert('Profile created successfully!');
        });
      }
    }
  }
}

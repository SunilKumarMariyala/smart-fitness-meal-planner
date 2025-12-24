import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss']
})
export class ProgressTrackerComponent implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // For simplicity, we'll assume a single user with ID 1.
    this.loadUser(1);
  }

  loadUser(id: number): void {
    this.userService.getUser(id).subscribe(user => {
      this.user = user;
    });
  }
}

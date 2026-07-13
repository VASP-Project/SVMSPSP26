import { Component, OnInit } from '@angular/core';
import { BadgeData, BadgeDetails } from './badgedetails.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeDetailsService } from './badgedetails.service';

@Component({
  selector: 'app-badgedetails',
  templateUrl: './badgedetails.component.html',
  styleUrls: ['./badgedetails.component.scss']
})
export class BadgedetailsComponent implements OnInit {
  badgeData: BadgeData = new BadgeData();
  photoUrl: string | ArrayBuffer | null = '';


  constructor( private activatedRoute: ActivatedRoute, 
    private _badgeDetailsService: BadgeDetailsService,
    private router: Router) { }

  ngOnInit(): void {
    this.GetBadgeDetails();
  }
  GetBadgeDetails() {
    this._badgeDetailsService.GetBadgeDetails().subscribe((response: any) => {
      this.badgeData = response;
     // this.loadPhoto();
       // If you want to display the image directly after uploading:
       this.photoUrl = 'data:image/png;base64,' +  this.badgeData.badgeDetails.photograph;
    });
  }

  loadPhoto(): void {
    this._badgeDetailsService.getPhoto().subscribe(
      (data: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.photoUrl = reader.result;
        };
        reader.readAsDataURL(data);
      },
      (error) => {
        console.error('Error fetching photo', error);
      }
    );
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SMSNovService } from '../smscou/smsnov.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CitationDetails, DataResult } from '../smscou/datamodel.model';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-smsnov',
  templateUrl: './smsnov.component.html',
  styleUrls: ['./smsnov.component.scss']
})
export class SmsnovComponent implements OnInit {
  citationDisplay: any
  htmlString: any;

  constructor(private router: Router, private route: ActivatedRoute,
    private NovService: SMSNovService,
    private sanitized: DomSanitizer

  ) { }
  transform(value) {
    console.log(this.sanitized.bypassSecurityTrustHtml(value))
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
  ngOnInit() {

    //var citationId: number = this.route.snapshot.pathFromRoot[1].queryParams['citationId'];
    const citationId = Buffer.from(this.route.snapshot.paramMap.get('id'), 'base64').toString('binary')
    const companyId = Buffer.from(this.route.snapshot.paramMap.get('cid'), 'base64').toString('binary')
    console.log("Converted Citaionid " +citationId )
    console.log("Converted companyId " +companyId )
    // var citationId = 101361;
    // var companyId = 1181
    this.GetCitationDetailsById(+citationId, +companyId);

  }

  public GetCitationDetailsById(citationId: number, companyId: number) {
    this.NovService.GetCitationDetailsById(citationId, companyId).subscribe((data: DataResult) => {
      console.log(data)
      if (data.errormsg == null) {
        console.log(data.data)
        this.citationDisplay = this.sanitized.bypassSecurityTrustHtml(data.data);
      } else if (data.errormsg == "1") {
        this.router.navigate(['/expire']);
      }
      else if (data.errormsg == "2") {
        this.router.navigate(['/authentication/404']);
      }
    }, (error: any) => {
      console.log("Error")     
      this.router.navigate(['/authentication/404']);
    });
  }

}

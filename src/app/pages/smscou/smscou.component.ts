import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CitationDetails, DataResult } from './datamodel.model';
import { SMSNovService } from './smsnov.service';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-smscou',
  templateUrl: './smscou.component.html',
  styleUrls: ['./smscou.component.scss']
})
export class SmscouComponent implements OnInit {
  citationDisplay: any

  constructor(private router: Router, private route: ActivatedRoute,
    private NovService: SMSNovService,
    private sanitized: DomSanitizer) { }

  ngOnInit() {

    //var citationId: number = this.route.snapshot.pathFromRoot[1].queryParams['citationId'];
    const citationId = Buffer.from(this.route.snapshot.paramMap.get('id'), 'base64').toString('binary')
    const companyId = Buffer.from(this.route.snapshot.paramMap.get('cid'), 'base64').toString('binary')
    console.log("Converted Citaionid " +citationId )
    console.log("Converted companyId " +companyId )
    // var citationId = 101361;
    //  var companyId = 1181
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
      //this.spinner.hide();
      this.router.navigate(['/authentication/404']);
    });
  }



}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {WebApiService} from '../../service/web-api.service';
import {environment} from '../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {retry} from 'rxjs/operators';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  accessPostBinUrl = environment.postbin_api_url + '/b/' + environment.postbin_key;
  accessMockBinUrl = environment.mockbinbin_api_url + '/' + environment.mockbinbin_key + '/log';

  isProcessing = false;
  contactForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private webApiService: WebApiService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: [null, Validators.required],
      message: [null, Validators.required]
    });
  }
  submit(): any {
    if (!this.contactForm.valid) {
      return;
    }
    this.isProcessing = true;
    this.webApiService.postBin.post(this.contactForm.value)
      .subscribe((data) => {
      /*
       * TODO
       * Duplicating set time out as post bin is not responding with proprt header and because of that we will not be here
       * Comment second setimeout if you are using moke bin as api gateway
       */
      setTimeout(() => {
        this.isProcessing = false;

        this.contactForm.reset();
        // For reset do not reset validation errors so do it manually
        /*Object.keys(this.contactForm.controls).forEach(key => {
          this.contactForm.controls[key].setErrors(null);
        });*/

        this.snackBar.open('We have received your request. Will get back to you soon. Check request here: ' + this.accessMockBinUrl, 'close', {duration: 7000});
      }, 1000);
    });
    // Comment below setTimeOut if mock bin is enabled
    setTimeout(() => {
      this.isProcessing = false;

      this.contactForm.reset();
      // For reset do not reset validation errors so do it manually
      /*Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.controls[key].setErrors(null);
      });*/
      this.snackBar.open('!!! Cross-Origin Request Blocked from POST BIN. Processed with error. Please read TODOs in code. Check request here: ' + this.accessPostBinUrl, 'close', {duration: 70000});
    }, 1000);
  }
}

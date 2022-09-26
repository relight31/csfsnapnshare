import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CameraService } from '../camera.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
})
export class ShareComponent implements OnInit {
  imageData!: string;
  imageWidth!: string;
  form!: FormGroup;
  canShare: boolean = false;

  constructor(
    private router: Router,
    private cameraSvc: CameraService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (!this.cameraSvc.dataUrl) {
      this.router.navigate(['/']);
      return;
    }

    const w = Math.floor(window.innerWidth * 0.9);
    this.imageWidth = `${w}`;

    this.imageData = this.cameraSvc.dataUrl;

    this.form = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      caption: this.fb.control('', [Validators.required]),
    });

    this.canShare = !!navigator.share;
    // !! converts whatever's behind it into true/false
  }

  shareIt() {
    console.info('>>>> data: ', this.form.value);
    const blob = this.cameraSvc.dataURItoBlob(this.cameraSvc.dataUrl);
    const formValue = this.form.value;
    navigator
      .share({
        title: formValue.title,
        text: formValue.caption,
        files: [
          new File([blob], formValue.title + '.jpg', { type: 'image/jpeg' }),
          // remember to put file extension in the title
        ],
      })
      .then((result) => {
        alert('shared ' + JSON.stringify(result));
      })
      .catch((error) => {
        alert('error: ' + JSON.stringify(error));
      });
    this.router.navigate(['/']);
  }
}

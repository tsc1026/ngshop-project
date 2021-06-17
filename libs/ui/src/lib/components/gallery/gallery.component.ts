import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ui-gallery',
  templateUrl: './gallery.component.html',
  styles: [
  ]
})
export class GalleryComponent implements OnInit {
  selectedImageUrl: string;
  @Input() images: string[];

  ngOnInit(): void {
    //set the first image to the main inage
    if(this.images.length){
      this.selectedImageUrl = this.images[0];
    }
  }

  //change the main image
  changeSelectedImage(imageUrl: string){
    this.selectedImageUrl = imageUrl;
  }

  get hasImages(){
    return this.images?.length > 0
  }

}

import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray
} from "@angular/forms";

@Component({
  selector: "app-details-form",
  templateUrl: "./details-form.component.html",
  styleUrls: ["./details-form.component.scss"]
})
export class DetailsFormComponent implements OnInit {
  details: string;
  detailsform_fb: FormGroup;
  details_fb: string;
  sports = ["cricket", "football"];

  constructor(private fb: FormBuilder) {}
  detailsFormErrors = {
    Name: "",
    School: "",
    Sports: "",
    Street: "",
    Landmark: ""
  };
  formValidationMessages = {
    Name: {
      required: " Name is required.",
      minlength: " Name must be greater than 3 characters.",
      maxlength: " Name must be less than 10 characters."
    },
    School: {
      required: "School is required.",
      minlength: " School name must be greater than 3 characters.",
      maxlength: "School  name must be less than 10 characters."
    },
    Sports: {
      required: "Sports Name is required."
    },
    Street: {
      required: "Street is required."
    },
    Landmark: {
      required: "Landmark is required."
    }
  };
  ngOnInit() {
    this.detailsform_fb = this.fb.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
      ],
      School: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
      ],
      Sports: ["",Validators.required],
      Address: this.fb.array([this.addressFormGroup()])
    });
    this.detailsform_fb.valueChanges.subscribe(data => {
      this.validationErrors(this.detailsform_fb);
    });
  }
  validationErrors(group: FormGroup ): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.detailsFormErrors[key] = "";
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        const messages = this.formValidationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.detailsFormErrors[key] += messages[errorKey] + " ";
          }
        }
      }
      
    
      if (abstractControl instanceof FormGroup) {
        this.validationErrors(abstractControl);
      } 
      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.validationErrors(control);
          }
        }
      }
     
       
      
    });
  }
  addressFormGroup() {
    return this.fb.group({
      Street: ["",Validators.required],
      Landmark: ["",Validators.required]
    });
  }

  showDetails_fb() {
    console.log(this.detailsform_fb.value);
    this.validationErrors(this.detailsform_fb);
    this.details_fb = JSON.stringify(this.detailsform_fb.value);
    console.log(this.detailsFormErrors)

  }
  handleAddAddress() {
    (<any>this.detailsform_fb.get("Address")).push(this.addressFormGroup());
  }
}

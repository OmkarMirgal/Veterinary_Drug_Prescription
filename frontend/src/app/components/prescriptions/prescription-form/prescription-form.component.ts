import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrescriptionService } from '../../../services/prescription/prescription-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICreatePrescription, IPrescriptionData } from '../../../model/prescription';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.css'
})
export class PrescriptionFormComponent {

  private prescriptionService = inject(PrescriptionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  prescriptionForm: FormGroup;
  isEditMode: boolean = false;
  prescriptionError: string | null = null;
  prescriptionSuccess: string | null = null;
  id?:number | null = null
  stableId: number | null = null

  constructor(private formBuilder: FormBuilder) {
    this.prescriptionForm = this.formBuilder.group({
      stable_id : ['' , [Validators.required, Validators.pattern('^[0-9]*$')]],
      indication: ['', [Validators.required]],
      diagnosisDetails: ['', [Validators.required]],
      application: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      amountUnit: ['', [Validators.required]],
      dosage: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      applicationDate: ['', [Validators.required]],
      applicationDuration: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      usageDuration: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      usageInstructions: ['', [Validators.required]],
    });

    // Check navigation state data
    // AddMode
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['stableId']) {
      this.stableId = navigation.extras.state['stableId'] as number;
      this.prescriptionForm.patchValue({stable_id: this.stableId})
    } 
    // EditMode
    if(navigation?.extras?.state?.['prescription'] as IPrescriptionData){
      const prescriptionData = navigation?.extras?.state?.['prescription'] as IPrescriptionData
      this.isEditMode = true;
      this.id = prescriptionData.id;
      this.prescriptionForm.patchValue(prescriptionData)
    }
  }

  // patch the value if changed by user by removing readonly from the stable Id field 
  ngOnInit() {
    this.prescriptionForm.controls['stable_id'].valueChanges.subscribe(change => {
      if(change !== this.stableId){
        this.prescriptionForm.patchValue({stable_id: this.stableId})
      }
    });
  }

  onSubmit(): void {
    if (this.prescriptionForm.invalid) {
      this.markAllAsTouched();
      return;
    }
    
    if (this.isEditMode) {
      this.edit();
    } else {
      this.create();
    }
  }

  create():void {
    const prescriptionData: ICreatePrescription = this.prescriptionForm.value;
    this.prescriptionService.createPrescription(prescriptionData).subscribe({
      next: (data:IPrescriptionData) => {
        this.prescriptionSuccess = "Prescription created successfully!"
        this.router.navigate(['/prescriptions']);
        this.clearAfterDelay();
      },
      error: (err) => {
        this.prescriptionError = err.message;
        this.clearAfterDelay();
      }
    })
  }

  edit():void {
    if(this.id){
      const prescriptionId = this.id;
      const updatedPrescriptionData: IPrescriptionData = this.prescriptionForm.value;
      this.prescriptionService.editStable(prescriptionId,updatedPrescriptionData).subscribe({
        next: (data:IPrescriptionData) => {
          this.prescriptionSuccess = "Prescription updated successfully!"
          this.router.navigate(['/prescriptions']);
          this.clearAfterDelay();
        },
        error: (err) => {
          this.prescriptionError = err.message;
          this.clearAfterDelay();
        }
      })
    }
  }

  private clearAfterDelay():void {
    setTimeout(() => {
      this.prescriptionError = null;
    }, 3000);
  }

  private markAllAsTouched():void {
    Object.keys(this.prescriptionForm.controls).forEach((field) => {
      const control = this.prescriptionForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

}

import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StableService } from '../../../services/stable/stable-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IStableData } from '../../../model/stable';

@Component({
  selector: 'app-stable-form',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './stable-form.component.html',
  styleUrl: './stable-form.component.css'
})
export class StableFormComponent {

  private stableService = inject(StableService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  stableForm: FormGroup;
  isEditMode: boolean = false;
  stableError: string | null = null;
  stableSuccess: string | null = null;
  id?:number | null = null

  constructor(private formBuilder: FormBuilder) {
    this.stableForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      location: ['', Validators.required],
      owner: ['', Validators.required],
    });

    // Check if there is navigation state data
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['stable']) {
      const stableData = navigation.extras.state['stable'] as IStableData;
      this.isEditMode = true;
      this.id = stableData.id;
      this.stableForm.patchValue(stableData);
    } else {
      // stables/edit/:id 
      this.route.paramMap.subscribe(params => {
        const stableIdParam = params.get('stableId');
        if (stableIdParam) {
          this.isEditMode = !!stableIdParam; // to enable edit mode 
          const stableId = +stableIdParam; //cast to number
          this.id = stableId;
          this.getStable(stableId);
        }
      });
    }
  }

  getStable(stableId: number){
    this.stableService.getStable(stableId).subscribe({
      next: (data:IStableData) => {
        this.stableForm.patchValue({
          name: data.name,
          location: data.location,
          owner: data.owner
        });
      },
      error: (err) => {
        this.stableError = err.message;
      }
    })
  }


  onSubmit(): void {
    if (this.stableForm.invalid) {
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
    const stableData: IStableData = this.stableForm.value;
    this.stableService.createStable(stableData).subscribe({
      next: (data:IStableData) => {
        this.stableSuccess = "Stable created successfully!"
        this.router.navigate(['/stables']);
        this.clearErrorAfterDelay();
      },
      error: (err) => {
        this.stableError = err.message;
        this.clearErrorAfterDelay();
      }
    })
  }

  edit():void {
    if(this.id){
      const stableId = this.id;
      const stableData: IStableData = this.stableForm.value;
      this.stableService.editStable(stableId,stableData).subscribe({
        next: (data:IStableData) => {
          this.stableSuccess = "Stable updated successfully!"
          this.router.navigate(['/stables']);
        },
        error: (err) => {
          this.stableError = err.message;
          this.clearErrorAfterDelay();
        }
      })
    }
  }

  private clearErrorAfterDelay():void {
    setTimeout(() => {
      this.stableError = null;
    }, 3000);
  }

  private markAllAsTouched():void {
    Object.keys(this.stableForm.controls).forEach((field) => {
      const control = this.stableForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }


}

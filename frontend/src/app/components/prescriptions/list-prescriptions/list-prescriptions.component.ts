import { Component, inject } from '@angular/core';
import { PrescriptionService } from '../../../services/prescription/prescription-service.service';
import { Router, RouterLink } from '@angular/router';
import { IPrescriptionData } from '../../../model/prescription';

@Component({
  selector: 'app-list-prescriptions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './list-prescriptions.component.html',
  styleUrl: './list-prescriptions.component.css'
})
export class ListPrescriptionsComponent {
  private prescriptionService = inject(PrescriptionService);
  private router = inject(Router);

  prescriptions: IPrescriptionData[] = []
  prescriptionError: string | null = null;
  prescriptionSuccess: string | null = null;

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.prescriptionService.getPrescriptions().subscribe({
      next: (response:IPrescriptionData[]|[]) => {
        this.prescriptions = response
      },
      error: (err) => {
        this.prescriptionError = 'Error fetching stables:'+ err
      }
    })
  }

  editPrescription(prescription:IPrescriptionData ):void {
    this.router.navigate(['prescriptions/edit'], { state: { prescription } });
  }

  deletePrescription(prescriptionId:number):void {
    this.prescriptionService.deletePrescription(prescriptionId).subscribe({
      next: () => {
        this.loadPrescriptions();
        this.prescriptionSuccess= "Prescription deleted successfully!"
        this.clearErrorAfterDelay()
      },
      error: (err) => {
        this.prescriptionError = err.message;
      }
    })
  }

  private clearErrorAfterDelay():void {
    setTimeout(() => {
      this.prescriptionError = null;
      this.prescriptionSuccess = null;
    }, 2000);
  }
}

import { Component, inject } from '@angular/core';
import { StableService } from '../../../services/stable/stable-service.service';
import { Router, RouterLink } from '@angular/router';
import { IStableData } from '../../../model/stable';

@Component({
  selector: 'app-list-stables',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './list-stables.component.html',
  styleUrl: './list-stables.component.css'
})
export class ListStablesComponent {

  private stableService = inject(StableService);
  private router = inject(Router);

  stables: IStableData[] = []
  stableError: string | null = null;
  stableSuccess: string | null = null;

  ngOnInit(): void {
    this.loadStables();
  }

  loadStables() {
    this.stableService.getStables().subscribe({
      next: (response:IStableData[]|[]) => {
        this.stables = response
      },
      error: (err) => {
        this.stableError = 'Error fetching stables:'+ err
      }
    });
  }

  editStable(stable:IStableData ):void {
    this.router.navigate(['stables/edit/', stable.id], { state: { stable } });
  }

  deleteStable(stableId:number):void {
    this.stableService.deleteStable(stableId).subscribe({
      next: () => {
        this.loadStables();
        this.stableSuccess = "Stable deleted successfully!"
        this.clearErrorAfterDelay()
      },
      error: (err) => {
        this.stableError = err.message;
      }
    })
  }

  addPrescription(stableId:number ):void {
    this.router.navigate(['prescriptions/add'], { state: { stableId } });
  }

  private clearErrorAfterDelay():void {
    setTimeout(() => {
      this.stableError = null;
      this.stableSuccess = null;
    }, 2000);
  }
  
}

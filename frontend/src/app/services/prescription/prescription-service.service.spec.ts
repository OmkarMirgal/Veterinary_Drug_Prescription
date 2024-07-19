import { TestBed } from '@angular/core/testing';

import { PrescriptionService } from './prescription-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ICreatePrescription, IPrescriptionData } from '../../model/prescription';

describe('PrescriptionService', () => {
  let service: PrescriptionService;
  let httpMock: HttpTestingController;
  let apiUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PrescriptionService]
    });
    service = TestBed.inject(PrescriptionService);
    httpMock = TestBed.inject(HttpTestingController);
    apiUrl = 'http://localhost:3000/api/prescriptions';
  });
  
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getPrescriptions', () => {
    it('should retrieve all prescriptions', () => {
      const mockPrescriptions: IPrescriptionData[] = [
        {
          "id": 1,
          "indication": "RESPIRATORY_DISEASE",
          "diagnosisDetails": "Diagnosedetails",
          "application": "FEED",
          "amount": 3,
          "amountUnit": "GRAM",
          "dosage": 2,
          "applicationDate": "2021-11-01",
          "applicationDuration": 15,
          "usageDuration": 15,
          "usageInstructions": "in the Feed",
          "user_id": 1,
          "stable_id": 2,
          "created_at": "2024-07-19T01:13:20.184Z",
          "updated_at": "2024-07-19T01:13:20.184Z"
      } as IPrescriptionData,
      {
        "id": 2,
        "indication": "RESPIRATORY_DISEASE",
        "diagnosisDetails": "Diagnosedetails",
        "application": "FEED",
        "amount": 3,
        "amountUnit": "GRAM",
        "dosage": 2,
        "applicationDate": "2021-11-01",
        "applicationDuration": 15,
        "usageDuration": 15,
        "usageInstructions": "in the Feed",
        "user_id": 1,
        "stable_id": 2,
        "created_at": "2024-07-19T01:13:20.184Z",
        "updated_at": "2024-07-19T01:13:20.184Z"
    } as IPrescriptionData,
      ];

      service.getPrescriptions().subscribe((prescriptions) => {
        expect(prescriptions.length).toBe(2);
        expect(prescriptions).toEqual(mockPrescriptions);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrescriptions);
    });
  });

  describe('#createPrescription', () => {
    it('should create a new prescription', () => {
      const newPrescription: ICreatePrescription = {
          indication:"Sometging wrong",
          diagnosisDetails:"Diagnosedetails",
          application:"FEED",
          amount:3,
          amountUnit:"GRAM",
          dosage:2,
          applicationDate:"2021-11-01",
          applicationDuration:15,
          usageDuration:15,
          usageInstructions:"in the Feed",
          stable_id: 2
      };
      const mockResponse: IPrescriptionData = {
        id: 5,
        indication:"Sometging wrong",
        diagnosisDetails:"Diagnosedetails",
        application:"FEED",
        amount:3,
        amountUnit:"GRAM",
        dosage:2,
        applicationDate:"2021-11-01",
        applicationDuration:15,
        usageDuration:15,
        usageInstructions:"in the Feed",
        stable_id: 2,
        created_at: "2024-07-19T18:35:06.395Z",
        updated_at: "2024-07-19T18:35:06.395Z"
    }    as IPrescriptionData;

      service.createPrescription(newPrescription).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ prescription: newPrescription });
      req.flush(mockResponse);
    });
  });

  describe('#editPrescription', () => {
    it('should update an existing prescription', () => {
      const updatedPrescription: ICreatePrescription = {
          indication:"Sometging wrong",
          diagnosisDetails:"Diagnosedetails",
          application:"FEED",
          amount:3,
          amountUnit:"GRAM",
          dosage:2,
          applicationDate:"2021-11-01",
          applicationDuration:15,
          usageDuration:15,
          usageInstructions:"in the Feed",
          stable_id: 2
      };
      const mockResponse: IPrescriptionData = {
          id:5,
          indication:"Sometging wrong",
          diagnosisDetails:"Diagnosedetails",
          application:"FEED",
          amount:3,
          amountUnit:"GRAM",
          dosage:2,
          applicationDate:"2021-11-01",
          applicationDuration:15,
          usageDuration:15,
          usageInstructions:"in the Feed",
          stable_id: 2,
          created_at: "2024-07-19T18:35:06.395Z",
          updated_at: "2024-07-19T18:35:06.395Z"
      } as IPrescriptionData;

      service.editStable(5, updatedPrescription).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/5`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ prescription: updatedPrescription });
      req.flush(mockResponse);
    });
  });

  describe('#deletePrescription', () => {
    it('should delete a prescription', () => {
      service.deletePrescription(1).subscribe((response) => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

});

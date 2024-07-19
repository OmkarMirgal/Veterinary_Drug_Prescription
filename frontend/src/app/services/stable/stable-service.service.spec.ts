import { TestBed } from '@angular/core/testing';

import { StableService } from './stable-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ICreateStable, IStableData } from '../../model/stable';

describe('StableServiceService', () => {
  let service: StableService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StableService],
    });
    service = TestBed.inject(StableService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStables', () => {
    it('should return a list of stables', () => {
      const expectedStables: IStableData[] = [
        {
          id: 1,
          name: "stable",
          location: "location",
          owner: "owner",
          user_id: 1,
          created_at: "2024-07-17T22:40:52.099Z",
          updated_at: "2024-07-17T22:40:52.099Z",
        } as IStableData,
        {
          id: 2,
          name: "stable1",
          location: "location1",
          owner: "owner1",
          user_id: 1,
          created_at: "2024-04-17T22:40:52.099Z",
          updated_at: "2024-05-17T22:40:52.099Z",
        } as IStableData
      ];

      service.getStables().subscribe(stables => {
        expect(stables).toEqual(expectedStables);
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/stables');
      expect(req.request.method).toEqual('GET');
      req.flush(expectedStables);
    });
  });

  describe('getStable', () => {
    it('should return a single stable', () => {
      const expectedStable: IStableData = 
      {
        id: 1,
        name: "stable",
        location: "location",
        owner: "owner",
        user_id: 1,
        created_at: "2024-07-17T22:40:52.099Z",
        updated_at: "2024-07-17T22:40:52.099Z",
      } as IStableData;

      service.getStable(1).subscribe(stable => {
        expect(stable).toEqual(expectedStable);
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/stables/1');
      expect(req.request.method).toEqual('GET');
      req.flush(expectedStable);
    });

    it('should handle errors correctly', () => {
      const errorMessage = 'An error occurred';

      service.getStable(1).subscribe({
        next: () => fail('Expected an error, but got a stable'), //cause the test to fail if a successful response is received
        error: (error) => {
          expect(error.message).toContain(errorMessage);
        }
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/stables/1');
      expect(req.request.method).toEqual('GET');
      req.flush({ error: errorMessage }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createStable', () => {
    it('should create a stable and return user object', () => {
      const createStableData: ICreateStable = {  name: "Stable", location: "loc", owner: "owner" } as ICreateStable;
      const expectedResponse = {
        id: 1,
        name: "Stable",
        location: "loc",
        owner: "owner",
        user_id: 1,
        created_at: "2024-07-17T22:40:52.099Z",
        updated_at: "2024-07-17T22:40:52.099Z",
      } as IStableData;

      service.createStable(createStableData).subscribe({
        next: (response) => {
            console.log(response);
            expect(response).toEqual(expectedResponse);
        },
        error: fail
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/stables');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ stable: createStableData });
      req.flush({
          id: 1,
          ...createStableData,
          user_id: 1,
          created_at: "2024-07-17T22:40:52.099Z",
          updated_at: "2024-07-17T22:40:52.099Z"
      });
      
    });

    it('should handle errors during creation', () => {
      const createStableData: ICreateStable = { name: "", location: "", owner: "" };
      const errorMessages = [
        "Name can't be blank",
        "Location can't be blank",
        "Owner can't be blank"
      ];
      const mockErrorResponse = { errors: errorMessages };

      service.createStable(createStableData).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.message).toContain("Name can't be blank,Location can't be blank,Owner can't be blank");
        }
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/stables');
      expect(req.request.method).toEqual('POST');
      req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
    });

    // TODO:uniqueLocation
  });

  describe('editStable', () => {
    it('should update a stable and return the updated stable', () => {
      const updateStableData: ICreateStable = {  name: "Stable", location: "loc", owner: "owner" } as ICreateStable;
      const expectedStable: IStableData = { id: 1, ...updateStableData } as IStableData;

      service.editStable(1, updateStableData).subscribe(stable => {
        expect(stable).toEqual(expectedStable);
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/stables/1');
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual({ stable: updateStableData });
      req.flush(expectedStable);
    });

    it('should handle errors during update', () => {
      const updateStableData: ICreateStable = {  name: "Stable", location: "locationnew", owner: "owner" } as ICreateStable;
      const errorMessage = 'An unknown error occurred';

      service.editStable(1, updateStableData).subscribe({
        next: () => fail('Expected an error, but got an updated stable'),
        error: (error) => {
          expect(error.message).toEqual(errorMessage);
        }
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/stables/1');
      expect(req.request.method).toEqual('PUT');
      req.flush({ error: errorMessage }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteStable', () => {
    it('should delete a stable and return success', () => {
      service.deleteStable(1).subscribe(response => {
        expect(response).toEqual({});
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/stables/1');
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    });

    it('should handle errors during deletion', () => {
      const errorMessage = 'No Stable Found';

      service.deleteStable(1).subscribe({
        next: () => fail('Expected an error, but got a successful deletion'),
        error: (error) => {
          expect(error.message).toContain(errorMessage);
        }
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/stables/1');
      expect(req.request.method).toEqual('DELETE');
      req.flush({ error: errorMessage }, { status: 500, statusText: 'No Stable Found' });
    });
  });

});

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  constructor(private httpService: HttpService) {}

  checkHealth(): Observable<any> {
    return this.httpService.get('/health');
  }
}
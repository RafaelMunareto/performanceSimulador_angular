
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.apiUrl + 'performance/';

@Injectable()
export class SimuladorPerformanceService {
  constructor(private http: HttpClient) {}

  store(resource: any) {
    return this.http.post<any>(
      API_URL + 'simulador/save',
      resource
    );
  }

  storeNotas(resource: any) {
    return this.http.post<any>(
      API_URL + 'simulador/save/notas',
      resource
    );
  }

  getAll(id: any[]) {
    return this.http.get<any[]>(API_URL + 'simulado/show/' + id);
  }

}

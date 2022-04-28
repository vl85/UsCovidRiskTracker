import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { StateStats } from './state-stats';

@Injectable({
  providedIn: 'root'
})
export class CovidStatsService {

  private covidStatsUrl = 'covidstats';  // URL to web api

  constructor(
    private http: HttpClient) { }

  getStatesStats(): Observable<StateStats[]> {
    return this.http.get<StateStats[]>(this.covidStatsUrl);
  }
}

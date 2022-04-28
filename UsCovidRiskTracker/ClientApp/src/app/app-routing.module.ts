import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskComponent } from './risk/risk.component';

const routes: Routes = [
  { path: 'risk', component: RiskComponent },
  { path: '', redirectTo: '/risk', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './component/applications/applications.component';
import { UtilisateursComponent } from './component/utilisateurs/utilisateurs.component';

const routes = [
  { path: '', pathMatch: 'full', redirectTo: '/applications' , text: "Applications" },
  { path: 'applications', 
    children: [
      { path: '', component: ApplicationsComponent }
    ]
  },
  { path: 'utilisateurs', component: UtilisateursComponent, text: "Utilisateurs" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

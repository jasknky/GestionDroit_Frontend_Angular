import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationsComponent } from './component/applications/applications.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule, DialogsModule } from "@progress/kendo-angular-dialog";
import { ReactiveFormsModule } from "@angular/forms";
import { ApplicationGroupeComponent } from './component/applications/application-groupe/application-groupe.component';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { UtilisateursComponent } from './component/utilisateurs/utilisateurs.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { FooterComponent } from './component/footer/footer.component';
import { MenuModule } from '@progress/kendo-angular-menu';
import { RouterModule } from '@angular/router';
import { ApplicationGroupeUtilisateurComponent } from './component/applications/application-groupe/application-groupe-utilisateur/application-groupe-utilisateur.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { UtilisateurGroupeComponent } from './component/utilisateurs/utilisateur-groupe/utilisateur-groupe.component';








@NgModule({
  declarations: [	
    AppComponent,
      ApplicationsComponent,
      ApplicationGroupeComponent,
      UtilisateursComponent,
      NavbarComponent,
      FooterComponent,
      ApplicationGroupeUtilisateurComponent,
      UtilisateurGroupeComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DialogModule,
    DialogsModule,
    ReactiveFormsModule,
    NotificationModule,
    InputsModule,
    ToolBarModule,
    NavigationModule,
    MenuModule,
    DropDownsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

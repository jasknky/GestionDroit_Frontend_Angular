import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder, FormArray  } from '@angular/forms';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { UtilisateurModel } from 'src/app/models/utilisateur.model';
import { concat, Observable,Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { InscriptionModel } from 'src/app/models/inscription.model';
import { ApplicationModel } from 'src/app/models/application.model';
import { GroupeModel } from 'src/app/models/groupe.model';
import { GroupeService } from 'src/app/services/groupe.service';
import { ApplicationService } from 'src/app/services/application.service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

export interface Utilisateur {
  USR_ID: number;
  USR_LOGIN: string;
  USR_NOM_COMPLET: string;
  USR_NOM: string;
  USR_PRENOM: string;
  USR_ACTIF: string;
  USR_ALT_MAIL: string;
  USR_ACTIF_BOOL:boolean;
}


@Component({
  selector: 'app-utilisateur-groupe',
  templateUrl: './utilisateur-groupe.component.html',
  styleUrls: ['./utilisateur-groupe.component.scss']
})
export class UtilisateurGroupeComponent implements OnInit {

  @Input() public utilisateur: Utilisateur;



  public gridView: GridDataResult;
  public formGroup: FormGroup;
  //public formGroups: FormGroup = new FormGroup({ items: new FormArray([]) });
  private editedRowIndex: number;

  public affichageComponent = false;

  public state: State = {
    skip: 0,
    take: 10,

    sort: [
      {
        field: 'APPLI_NOM_COURT',
        dir: 'asc'
      },
      {
        field: 'GRP_NOM',
        dir: 'asc'
      }
    ]
  };

  items:InscriptionModel[] = [];

  public applications:ApplicationModel[] = [];
  public groupes:GroupeModel[] = [];



  public setApplication(id_APPLI: number): any {
    const myTest:ApplicationModel = this.applications.find((x) => x.APPLI_ID === id_APPLI);
    //console.log(myTest);
    return this.applications.find((x) => x.APPLI_ID === id_APPLI);
  }

  public setGroupe(id_GRP: number): any {
    //const myTest:UtilisateurModel = this.utilisateurs.find((x) => x.USR_ID === id_USR);
    //console.log(myTest);
    return this.groupes.find((x) => x.GRP_ID === id_GRP);
  }

  public testSelectionChange(value: any): void {
    //console.log("value:");
    //console.log(value);
    this.formGroup = value;
    //console.log(this.formGroup);

  }


  ngOnChanges( changes: SimpleChanges) {
    //console.log(changes.currentValue);
    this.applicationervice.getApplicationsByIdUtilisateur(changes.utilisateur.currentValue.USR_ID ).subscribe(
      res => 
      //console.log(res)
      this.updateGrid(res)
      );
  }

  ngOnInit() {

    this.applicationervice.getAllApplications().subscribe(res => this.applications = res);
    this.groupeService.getAllGroupes().subscribe(res => this.groupes = res);
  }

  public updateGrid(res: any) {
    // this.items = res;
    // (this.items.length>0)?this.affichageComponent= true : this.affichageComponent=false ;
    this.gridView = process(res, this.state);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.items, this.state);
  }

//   public onChange(value)
//   {
//    const test = this.state.filter.filters = [
//      {
//        field: "USR_NOM_COMPLET",
//        operator: "contains",
//        value: value
//     }
//    ];

//    this.gridView = process(this.items, this.state);

//  }

//  public onButtonClick(filterAppNomValue:string): void {
//    const test = this.state.filter.filters = [
//      {
//        field: "USR_NOM_COMPLET",
//        operator: "contains",
//        value: filterAppNomValue
//     }
//    ];

//    this.gridView = process(this.items, this.state);
//  }

//  public onKeyDownEvent(value) {
//    console.log(value);

//  }

 
   constructor(private groupeService: GroupeService,private applicationervice: ApplicationService,private utilisateurService: UtilisateurService) {}


  //  public onApplicationChange(value: any): void {
  //   //console.log("value:");
  //   //console.log(value);
  //   this.formGroup = value;
  //   //console.log(this.formGroup);

  // }

  // public selectionGroupeChange(value: any): void {
  //   //console.log("value:");
  //   //console.log(value);
  //   this.formGroup = value;
  //   //console.log(this.formGroup);

  // }

  public getGroupes(applicationId: number) {
    this.groupes = applicationId
      ? this.gridView.data
          .filter((item) => item.GRP_APPLI_ID === applicationId)
          .map((item) => item.GRP_NOM)
      : this.gridView.data.map((item) => item.GRP_NOM);
  }

  public onApplicationChange(e) {
    this.getGroupes(e);
    this.formGroup.controls.GRP_ID.setValue(undefined);
  }


   public addHandler({ sender }) {
    
    this.closeEditor(sender);

    this.formGroup = new FormGroup({
      GRP_APPLI_ID: new FormControl(''),
      GRP_ID: new FormControl(''),
      APPLI_NOM_COURT: new FormControl(''),
      GRP_NOM: new FormControl('')
    });

    sender.addRow(this.formGroup);
  }

  /**
   * Ferme l'éditeur
   * @param param0
   */
   public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }


  public editHandler({ sender, rowIndex, dataItem }) {

    const utilisateur  = new FormGroup({
      GRP_APPLI_ID: new FormControl(dataItem.GRP_APPLI_ID, Validators.required),
      GRP_ID: new FormControl(dataItem.GRP_ID, Validators.required),
      APPLI_NOM_COURT: new FormControl(dataItem.APPLI_NOM_COURT),
      GRP_NOM:new FormControl(dataItem.GRP_NOM)
    });

    // put the row in edit mode, with the `FormGroup` build above
    sender.editRow(rowIndex, utilisateur);


  }

  
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    // console.log("formGroup.value");
    // console.log(this.formGroup);

        // console.log("utilisateur");
    // console.log(utilisateur);
    // console.log("this.groupe");
    // console.log(this.groupe);
    // console.log("this.groupe.GRP_ID");
    // console.log(this.groupe.GRP_ID);


    // const utilisateur: any = this.formGroup;

    // const fetch$ = this.utilisateurService.getUtilisateursByIdGroupe(this.groupe.GRP_ID);

    // const add$ = this.utilisateurService.addUtilisateurInGroupe(utilisateur,utilisateur.USR_ID,this.groupe.GRP_ID);

 
    //   const arr = [add$, fetch$];
    //   concat(...arr)
    //     .pipe(toArray())
    //     .subscribe(res => this.updateGrid(res[1]));
    // sender.closeRow(rowIndex);
  }

  /**
   *  Supprime une équipe
   * @param param
   */
  public removeHandler({ dataItem }) {
    // const remove$ = this.utilisateurService.deleteUtilisateurFromGroupe(dataItem.USR_ID,this.groupe.GRP_ID);
    // const fetch$ = this.utilisateurService.getUtilisateursByIdGroupe(this.groupe.GRP_ID);
    // const arr = [remove$, fetch$];
    // concat(...arr)
    //   .pipe(toArray())
    //   .subscribe(res => this.updateGrid(res[1]));
  }

 
  /**
   *
   * @param grid Ferme l'editeur
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

}

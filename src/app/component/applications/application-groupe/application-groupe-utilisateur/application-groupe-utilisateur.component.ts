import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder, FormArray  } from '@angular/forms';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { UtilisateurModel } from 'src/app/models/utilisateur.model';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { concat, Observable,Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';


export interface Groupe {
  GRP_ID: number;
  GRP_APPLI_ID: number;
  GRP_NOM: string;
  GRP_DESCRIPTION: string;
}

// const createFormGroup = (dataItem) =>
//   new FormGroup({
//     USR_LOGIN: new FormControl(''),
//     USR_NOM_COMPLET: new FormControl(''),
//     USR_NOM: new FormControl(''),
//     USR_PRENOM: new FormControl(''),
//     USR_ACTIF: new FormControl(''),
//     USR_ALT_MAIL:new FormControl('')

//     USR_LOGIN: new FormControl(dataItem.USR_LOGIN),
//     ProductName: new FormControl(dataItem.ProductName, Validators.required),
//     UnitPrice: new FormControl(dataItem.UnitPrice),
//     UnitsInStock: new FormControl(
//       dataItem.UnitsInStock,
//       Validators.compose([
//         Validators.required,
//         Validators.pattern("^[0-9]{1,3}"),
//       ])
//     ),
//     CategoryID: new FormControl(dataItem.CategoryID, Validators.required),
//   });

@Component({
  selector: 'app-application-groupe-utilisateur',
  templateUrl: './application-groupe-utilisateur.component.html',
  styleUrls: ['./application-groupe-utilisateur.component.scss']
})
export class ApplicationGroupeUtilisateurComponent implements OnInit, OnChanges {

  @Input() public groupe: Groupe;



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
        field: 'USR_NOM_COMPLET',
        dir: 'asc'
      }
    ]
  };

  items:UtilisateurModel[] = [];

  public utilisateurs:UtilisateurModel[] = [];

  // public getUtilisateur(userId: number) {
  //   this.items = userId
  //     ? this.gridView
  //         .filter((item) => item.CategoryID === categoryId)
  //         .map((item) => item.ProductName)
  //     : this.gridData.map((item) => item.ProductName);
  // }

  // public onCategoryChange(e) {
  //   this.getUtilisateur(e);
  //   this.formGroup.controls.ProductName.setValue(undefined);
  // }

  public setUtilisateur(id_USR: number): any {
    const myTest:UtilisateurModel = this.utilisateurs.find((x) => x.USR_ID === id_USR);
    //console.log(myTest);
    return this.utilisateurs.find((x) => x.USR_ID === id_USR);
  }

  ngOnChanges( changes: SimpleChanges) {
    //console.log(changes.currentValue);
    this.utilisateurService.getUtilisateursByIdGroupe(changes.groupe.currentValue.GRP_ID).subscribe(
      res => 
      //console.log(res)
      this.updateGrid(res)
      );
  }

  ngOnInit() {
    this.utilisateurService.getAllUtilisateurs().subscribe(res => this.utilisateurs = res);
  }

  public updateGrid(res: any) {
    this.items = res;
    (this.items.length>0)?this.affichageComponent= true : this.affichageComponent=false ;
    this.gridView = process(res, this.state);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.items, this.state);
  }

  public onChange(value)
  {
   const test = this.state.filter.filters = [
     {
       field: "USR_NOM_COMPLET",
       operator: "contains",
       value: value
    }
   ];

   this.gridView = process(this.items, this.state);

 }

 public onButtonClick(filterAppNomValue:string): void {
   const test = this.state.filter.filters = [
     {
       field: "USR_NOM_COMPLET",
       operator: "contains",
       value: filterAppNomValue
    }
   ];

   this.gridView = process(this.items, this.state);
 }

 public onKeyDownEvent(value) {
   console.log(value);

 }

 
   constructor(private utilisateurService: UtilisateurService) {}


   public selectionChange(value: any): void {
    //console.log("value:");
    //console.log(value);
    this.formGroup = value;
    //console.log(this.formGroup);

  }


   public addHandler({ sender }) {
    
    this.closeEditor(sender);

    // this.formGroup = createFormGroup({
    //   ProductName: "",
    //   UnitPrice: 0,
    //   UnitsInStock: "",
    //   CategoryID: 1,
    // });

    this.formGroup = new FormGroup({
      USR_LOGIN: new FormControl(''),
      USR_NOM_COMPLET: new FormControl(''),
      USR_NOM: new FormControl(''),
      USR_PRENOM: new FormControl(''),
      USR_ACTIF: new FormControl(''),
      USR_ALT_MAIL:new FormControl('')
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
      USR_ID: new FormControl(dataItem.USR_ID, Validators.required),
      USR_LOGIN: new FormControl(dataItem.USR_LOGIN,),
      USR_NOM_COMPLET: new FormControl(dataItem.USR_NOM_COMPLET),
      USR_NOM:new FormControl(dataItem.USR_NOM),
      USR_PRENOM:new FormControl(dataItem.USR_PRENOM),
      USR_ACTIF:new FormControl(dataItem.USR_ACTIF),
      USR_ALT_MAIL:new FormControl(dataItem.USR_ALT_MAIL)
    });

    // put the row in edit mode, with the `FormGroup` build above
    sender.editRow(rowIndex, utilisateur);

    // this.closeEditor(sender);

    // //this.formGroup = createFormGroup(dataItem);

    // this.editedRowIndex = rowIndex;

    // sender.editRow(rowIndex, this.formGroup);
  }

  
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    // console.log("formGroup.value");
    // console.log(this.formGroup);
    const utilisateur: any = this.formGroup;
    console.log("utilisateur");
    console.log(utilisateur);
    console.log("this.groupe");
    console.log(this.groupe);
    console.log("this.groupe.GRP_ID");
    console.log(this.groupe.GRP_ID);
    const fetch$ = this.utilisateurService.getUtilisateursByIdGroupe(this.groupe.GRP_ID);

    const add$ = this.utilisateurService.addUtilisateurInGroupe(utilisateur,utilisateur.USR_ID,this.groupe.GRP_ID);

    //const add$ = this.utilisateurService.addUtilisateur(utilisateur);
      const arr = [add$, fetch$];
      concat(...arr)
        .pipe(toArray())
        .subscribe(res => this.updateGrid(res[1]));
    sender.closeRow(rowIndex);
  }

  /**
   *  Supprime une équipe
   * @param param
   */
  public removeHandler({ dataItem }) {
    const remove$ = this.utilisateurService.deleteUtilisateurFromGroupe(dataItem.USR_ID,this.groupe.GRP_ID);
    const fetch$ = this.utilisateurService.getUtilisateursByIdGroupe(this.groupe.GRP_ID);
    const arr = [remove$, fetch$];
    concat(...arr)
      .pipe(toArray())
      .subscribe(res => this.updateGrid(res[1]));
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

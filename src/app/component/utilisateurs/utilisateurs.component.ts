import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder  } from '@angular/forms';

import { DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { process,State } from '@progress/kendo-data-query';
import { concat, Observable,Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { UtilisateurModel } from 'src/app/models/utilisateur.model';

import { NotificationService } from "@progress/kendo-angular-notification";

import {
  DialogService,
  DialogRef,
  DialogCloseResult,
} from "@progress/kendo-angular-dialog";
import { UtilisateurService } from 'src/app/services/utilisateur.service';

class MyUtilisateurModel implements UtilisateurModel {
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
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {

  public gridView!: GridDataResult;
  public formGroup: FormGroup;
  private editedRowIndex: number;

  //public groupeItems:number;

  //public opened = false;
  appNomFilterValue:string ;

  
  //public result;

  public selectedUtilisateur:UtilisateurModel ;

   

  public state: State = {
    skip: 0,
    take: 10,

    sort: [
      {
        field: 'USR_NOM_COMPLET',
        dir: 'asc'
      }
    ],
    filter:{
      logic: 'and',
      filters:[{
        field:'USR_NOM_COMPLET',
        operator:'contains',
        value:''
      }]
    }
  };

  items:UtilisateurModel[] = [];

 

  ngOnInit() {
    this.utilisateurService.getAllUtilisateurs().subscribe(res => this.updateGrid(res));
  }

  public ngAfterViewInit(): void {
    // Expand the first row initially
    //this.grid.expandRow(0);
  }
  
  public updateGrid(res: any) {
    //this.items = res ;
    const newRes = res.map(item => {
      return this.modifyUtilisateurActif(item)
  });
    // const newRes:UtilisateurModel[] = [];
    // for (var i = 0; i < res.length; i++) {
    //   newRes[i] = this.modifyUtilisateurActif(res[i]);
    // }
    this.items = newRes;
    //this.items = JSON.stringify(newRes);

    this.gridView = process(this.items, this.state);
    
  }

  public modifyUtilisateurActif(myItem:UtilisateurModel) : UtilisateurModel
  {
    if(myItem.USR_ACTIF === 'N')
    { 
      myItem.USR_ACTIF_BOOL = false ;
    }
    else if (myItem.USR_ACTIF === 'O')
    {
      myItem.USR_ACTIF_BOOL = true ;
    }

    return myItem;
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

 public toggle(dataItem: any,formGroup): void {
  if(dataItem.USR_ACTIF_BOOL === false)
  { 
    dataItem.USR_ACTIF = 'O'
    formGroup.value.USR_ACTIF ='O';
  }
  else if(dataItem.USR_ACTIF_BOOL === true)
  {
    dataItem.USR_ACTIF = 'N'
    formGroup.value.USR_ACTIF ='N';
  }
}

  // constructor(private applicationService: ApplicationService,private formBuilder: FormBuilder) {
  //   this.removeConfirmation = this.removeConfirmation.bind(this);
  // }

   constructor(private utilisateurService: UtilisateurService,
    private dialogService: DialogService, 
    private ngZone: NgZone,
    private notificationService: NotificationService) {}

  public addHandler({ sender }) {
    this.formGroup = new FormGroup({
      USR_LOGIN: new FormControl('', Validators.required),
      USR_NOM_COMPLET: new FormControl(''),
      USR_NOM: new FormControl(''),
      USR_PRENOM: new FormControl(''),
      USR_ACTIF: new FormControl('N'),
      USR_ALT_MAIL:new FormControl('', Validators.email),
      USR_ACTIF_BOOL:new FormControl(false)
    });

    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    // define all editable fields validators and default values
    const group = new FormGroup({
      USR_ID: new FormControl(dataItem.USR_ID),
      USR_LOGIN: new FormControl(dataItem.USR_LOGIN, Validators.required),
      USR_NOM_COMPLET: new FormControl(dataItem.USR_NOM_COMPLET),
      USR_NOM: new FormControl(dataItem.USR_NOM),
      USR_PRENOM: new FormControl(dataItem.USR_PRENOM),
      USR_ACTIF: new FormControl(dataItem.USR_ACTIF),
      USR_ALT_MAIL:new FormControl(dataItem.USR_ALT_MAIL, Validators.email),
      USR_ACTIF_BOOL: new FormControl(dataItem.USR_ACTIF_BOOL)

    });

    // put the row in edit mode, with the `FormGroup` build above
    sender.editRow(rowIndex, group);
  }

  /**
   * Ferme l'éditeur
   * @param param0
   */
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  /**
   * Persiste une nouvelle équipe
   * @param param0
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    const utilisateur: any = formGroup.value;
    const fetch$ = this.utilisateurService.getAllUtilisateurs();

    if (isNew) {
      const add$ = this.utilisateurService.addUtilisateur(utilisateur);
      const arr = [add$, fetch$];
      concat(...arr)
        .pipe(toArray())
        .subscribe(res => this.updateGrid(res[1]));
    } else {
      const update$ = this.utilisateurService.updateUtilisateur(utilisateur);
      const arr = [update$, fetch$];
      concat(...arr)
        //les valeurs sont mises dans un tableau
        .pipe(toArray())
        .subscribe(res => this.updateGrid(res[1]));
    }
    sender.closeRow(rowIndex);
  }

  /**
   *  Supprime une équipe
   * @param param
   */


  public removeHandler({ dataItem }) {
    

    this.ngZone.run(() => {
      this.dialogService
        .open({
          title: "Confirmation avant suppression",
          content: "Etes vous sur de vouloir supprimer l'utilisateur "+dataItem.USR_NOM_COMPLET+ " ?",
          actions: [{ text: "Yes", primary: true,value:1 }, { text: "Non",value:0 }],
          width: 550,
          height: 200,
          minWidth: 250,
        })
        .result.subscribe((result) => {
          if (result instanceof DialogCloseResult) {
            //console.log("close");
          } else {
            console.log("action", result);
            if (result.text === 'Yes')
            {
              console.log("dataItem",dataItem);
              const remove$ = this.utilisateurService.deleteUtilisateur(dataItem.USR_ID);
              const fetch$ = this.utilisateurService.getAllUtilisateurs();
              const arr = [remove$, fetch$];
              concat(...arr)
                .pipe(toArray())
                .subscribe(res => this.updateGrid(res[1]));

                this.notificationService.show({
                  content: "utilisateur supprimé avec succès",
                  cssClass: "button-notification",
                  animation: { type: "slide", duration: 100 },
                  position: { horizontal: "center", vertical: "bottom" },
                  type: { style: "success", icon: true },
                  hideAfter: 1000,
                });
            }
          }
        });
    });
  }


  // gridGroupeEmpty(value: number): void {
  //   this.groupeItems = value;

  // }

  // public showGroupeIfFn(dataItem: any, index: number): boolean {
  //   return this.groupeItems > 0;
  // }

  // public showGroupeIfFonction(): boolean {
  //   return this.groupeItems > 0;
  // }

  onExpandHandler(e) {
    this.collapseAll(e)}
    
    
     public collapseAll(row: number = -1) {
    // this.gridView.subscribe(itm => {
    //   let i = 0;
    //   for (i = 0; i < itm.data.length; i++) { if (i != row) this.grid.collapseRow(i); }
    // })
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

  gridUtilisateurSelectionChange(gridUtilisateur, selection) {
      // let selectedData = gridUser.data.data[selection.index];
      const selectedData = selection.selectedRows[0].dataItem;
      //console.log(selectedData);
      this.selectedUtilisateur = selectedData;
  }

}

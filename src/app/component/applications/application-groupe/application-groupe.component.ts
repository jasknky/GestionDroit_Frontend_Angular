import { Component, EventEmitter, Input, OnInit, Output,OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder  } from '@angular/forms';

import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { process,State } from '@progress/kendo-data-query';
import { concat, Observable,Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { ApplicationModel } from 'src/app/models/application.model';
import { GroupeModel } from 'src/app/models/groupe.model';
import { GroupeService } from 'src/app/services/groupe.service';




export interface Application {
  APPLI_ID: number;
  APPLI_NOM_COURT: string;
  APPLI_NOM_LONG: string;
  APPLI_DESCRIPTION: string;
  APPLI_EMAIL: string;
}


@Component({
  selector: 'app-application-groupe',
  templateUrl: './application-groupe.component.html',
  styleUrls: ['./application-groupe.component.scss']
})
export class ApplicationGroupeComponent implements OnInit, OnChanges {

  @Input() public application: Application;

  @Output()
  gridGroupeEmpty = new EventEmitter<number>();

   public selectedGroupe:GroupeModel ;

  displayEmpty = true;

  public gridView: GridDataResult;
  public formGroup: FormGroup;
  private editedRowIndex: number;
  
  public result;

  public affichageComponent = false;
  public nbItems:number;

  public state: State = {
    skip: 0,
    take: 10,

    sort: [
      {
        field: 'GRP_NOM',
        dir: 'asc'
      }
    ]
  };

  items:GroupeModel[] = [];

  ngOnChanges( changes: SimpleChanges) {
    console.log(changes.currentValue);
    this.groupeService.getGroupesByIdApplication(changes.application.currentValue.APPLI_ID).subscribe(
      res => this.updateGrid(res)
      );
  }
 

  ngOnInit() {
    //this.groupeService.getGroupesByIdApplication(this.application.APPLI_ID).subscribe(res => this.updateGrid(res));
    //console.log('enfantInit');
    //console.log(this.gridView);
  }

  public updateGrid(res: any) {
    this.items = res;
    this.nbItems = this.items.length;
    (this.items.length>0)?this.affichageComponent= true : this.affichageComponent=false ;
    this.gridView = process(res, this.state);
    this.gridGroupeEmpty.emit(this.nbItems);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.items, this.state);
  }

  

 
   constructor(private groupeService: GroupeService) {}

  public addHandler({ sender }) {
    this.formGroup = new FormGroup({
      GRP_APPLI_ID: new FormControl(this.application.APPLI_ID, Validators.required),
      GRP_NOM: new FormControl(''),
      GRP_DESCRIPTION:new FormControl('')
    });

    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    // define all editable fields validators and default values
    const group = new FormGroup({
      GRP_ID: new FormControl(dataItem.GRP_ID, Validators.required),
      GRP_APPLI_ID: new FormControl(dataItem.GRP_APPLI_ID, Validators.required),
      GRP_NOM: new FormControl(dataItem.GRP_NOM),
      GRP_DESCRIPTION:new FormControl(dataItem.GRP_DESCRIPTION)
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
    const groupe: any = formGroup.value;
    const fetch$ = this.groupeService.getGroupesByIdApplication(groupe.GRP_APPLI_ID);

    if (isNew) {
      const add$ = this.groupeService.addGroupe(groupe);
      const arr = [add$, fetch$];
      concat(...arr)
        .pipe(toArray())
        .subscribe(res => this.updateGrid(res[1]));
    } else {
      const update$ = this.groupeService.updateGroupe(groupe);
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
    const remove$ = this.groupeService.deleteGroupe(dataItem.GRP_ID);
    const fetch$ = this.groupeService.getGroupesByIdApplication(dataItem.GRP_APPLI_ID);
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

  gridGroupeSelectionChange(gridGroupe, selection) {
    // let selectedData = gridUser.data.data[selection.index];
    const selectedData = selection.selectedRows[0].dataItem;
    //console.log(selectedData);
    this.selectedGroupe = selectedData;
}

}

import { AfterViewInit, Component, OnInit, ViewChild,NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder  } from '@angular/forms';

import { DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { process,State } from '@progress/kendo-data-query';
import { concat, Observable,Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { ApplicationModel } from 'src/app/models/application.model';

import { NotificationService } from "@progress/kendo-angular-notification";

import {
  DialogService,
  DialogRef,
  DialogCloseResult,
} from "@progress/kendo-angular-dialog";
import { ApplicationService } from 'src/app/services/application.service';



@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit,AfterViewInit {

  //@ViewChild('detailComponent') grid: GridComponent;

  public gridView!: GridDataResult;
  public formGroup: FormGroup;
  private editedRowIndex: number;

  public groupeItems:number;

  public opened = false;
  appNomFilterValue:string ;

  
  public result;

  public selectedApplication:ApplicationModel ;

  // public removeConfirmationSubject: Subject<boolean> = new Subject<boolean>();
  // public itemToRemove: any;
  

  public state: State = {
    skip: 0,
    take: 10,

    sort: [
      {
        field: 'APPLI_NOM_COURT',
        dir: 'asc'
      }
    ],
    filter:{
      logic: 'and',
      filters:[{
        field:'APPLI_NOM_COURT',
        operator:'contains',
        value:''
      }]
    }
  };

  items:ApplicationModel[] = [];

 

  ngOnInit() {
    this.applicationService.getAllApplications().subscribe(res => this.updateGrid(res));
  }

  public ngAfterViewInit(): void {
    // Expand the first row initially
    //this.grid.expandRow(0);
  }
  
  public updateGrid(res: any) {
    this.items = res;
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
       field: "APPLI_NOM_COURT",
       operator: "contains",
       value: value
    }
   ];

   this.gridView = process(this.items, this.state);

 }

 public onButtonClick(filterAppNomValue:string): void {
   const test = this.state.filter.filters = [
     {
       field: "APPLI_NOM_COURT",
       operator: "contains",
       value: filterAppNomValue
    }
   ];

   this.gridView = process(this.items, this.state);
 }

 public onKeyDownEvent(value) {
   console.log(value);

 }

  // constructor(private applicationService: ApplicationService,private formBuilder: FormBuilder) {
  //   this.removeConfirmation = this.removeConfirmation.bind(this);
  // }

   constructor(private applicationService: ApplicationService,
    private dialogService: DialogService, 
    private ngZone: NgZone,
    private notificationService: NotificationService) {}

  public addHandler({ sender }) {
    this.formGroup = new FormGroup({
      APPLI_NOM_COURT: new FormControl('', Validators.required),
      APPLI_NOM_LONG: new FormControl(''),
      APPLI_DESCRIPTION: new FormControl(''),
      APPLI_EMAIL:new FormControl('', Validators.email)
    });

    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    // define all editable fields validators and default values
    const group = new FormGroup({
      APPLI_ID: new FormControl(dataItem.APPLI_ID),
      APPLI_NOM_COURT: new FormControl(dataItem.APPLI_NOM_COURT, Validators.required),
      APPLI_NOM_LONG: new FormControl(dataItem.APPLI_NOM_LONG),
      APPLI_DESCRIPTION: new FormControl(dataItem.APPLI_DESCRIPTION),
      APPLI_EMAIL:new FormControl(dataItem.APPLI_EMAIL, Validators.email)
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
    const application: any = formGroup.value;
    const fetch$ = this.applicationService.getAllApplications();

    if (isNew) {
      const add$ = this.applicationService.addApplication(application);
      const arr = [add$, fetch$];
      concat(...arr)
        .pipe(toArray())
        .subscribe(res => this.updateGrid(res[1]));
    } else {
      const update$ = this.applicationService.updateApplication(application);
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
  // public removeHandler({ dataItem }) {
  //   const remove$ = this.applicationService.deleteApplication(dataItem.APPLI_ID);
  //   const fetch$ = this.applicationService.getAllApplications();
  //   const arr = [remove$, fetch$];
  //   concat(...arr)
  //     .pipe(toArray())
  //     .subscribe(res => this.updateGrid(res[1]));
  // }

  public removeHandler({ dataItem }) {
    

    this.ngZone.run(() => {
      this.dialogService
        .open({
          title: "Confirmation avant suppression",
          content: "Etes vous sur de vouloir supprimer l'application "+dataItem.APPLI_NOM_COURT+ " ?",
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
              const remove$ = this.applicationService.deleteApplication(dataItem.APPLI_ID);
              const fetch$ = this.applicationService.getAllApplications();
              const arr = [remove$, fetch$];
              concat(...arr)
                .pipe(toArray())
                .subscribe(res => this.updateGrid(res[1]));

                this.notificationService.show({
                  content: "application supprimée avec succès",
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


  gridGroupeEmpty(value: number): void {
    this.groupeItems = value;

  }

  public showGroupeIfFn(dataItem: any, index: number): boolean {
    return this.groupeItems > 0;
  }

  public showGroupeIfFonction(): boolean {
    return this.groupeItems > 0;
  }

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

  gridApplicationSelectionChange(gridApplication, selection) {
      // let selectedData = gridUser.data.data[selection.index];
      const selectedData = selection.selectedRows[0].dataItem;
      //console.log(selectedData);
      this.selectedApplication = selectedData;
  }
}





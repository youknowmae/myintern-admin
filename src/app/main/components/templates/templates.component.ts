import { Component, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../services/data.service';
import Swal from 'sweetalert2';
import { AddTemplateComponent } from './components/add-template/add-template.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { PdfPreviewComponent } from '../../../components/pdf-preview/pdf-preview.component';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent {
  displayedColumns: string[] = ['name', 'actions'];

  dataSource: any = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;

  
  isSubmitting: boolean = false
  
  constructor(
    private dialogRef: MatDialog,
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService,
    private gs: GeneralService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit() {
    this.getTemplates() 
  }

  getTemplates() {
    this.ds.get('adviser/templates').subscribe(
      templates => {
        this.dataSource.data = templates;
        this.dataSource.paginator = this.paginator;
      },
      error => {
        // console.error(error)
      }
    )

  }
  
  addTemplate() {
    var modal = this.dialogRef.open(AddTemplateComponent, {
      disableClose: true 
    })
    
    modal.afterClosed().subscribe((result) => {
      if (!result) {
        return
      }
      
      this.dataSource.data = [...this.dataSource.data, result]
    });
  }

  previewTemplate(template: any) {
    if(!template.pdf) {
      Swal.fire({
        title: 'Error!',
        text: 'This file has no pdf preview file.',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: '#777777',
      });
      return
    }

    this.dialogRef.open(PdfPreviewComponent, {
      data: { name: template.name, pdf: template.pdf},
      disableClose: true
    })
  }

  editTemplate(template: any) {
    var modal = this.dialogRef.open(EditTemplateComponent, {
      data: template,
      disableClose: true 
    })
    
    modal.afterClosed().subscribe((result) => {
      if (!result) {
        return
      }
      
      this.dataSource.data = this.dataSource.data.map((template: any) =>
        template.id === result.id ? result : template
      );
    });
  }

  deleteTemplate(id: number) {
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true

    this.ds.get(`adviser/templates/${id}/delete`).subscribe(
      result => {
        
        this.isSubmitting = false
        this.dataSource.data = this.dataSource.data.filter((template: any) => template.id !== id);
        this.gs.successAlert('Success', 'Template has been deleted.')
      },
      error => {
        this.isSubmitting = false
        // console.error(error)
        if(error.status == 409) {
          this.gs.errorAlert('Error', error.error)
        }
        else {
          this.gs.errorAlert('Oops!', "Something went wrong. Please try again later.")
        }

        // Swal.fire({
        //   title: 'Error!',
        //   text: 'Something went wrong. Please try again later.',
        //   icon: 'error',
        //   confirmButtonText: 'Close',
        //   confirmButtonColor: '#777777',
        // });
      })

  }

  deleteConfirmation(id: number) {
    Swal.fire({
      title: 'Delete?',
      text: 'Are you sure you want to delete this template?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTemplate(id);
      }
    });
  }

}

import { Component, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

import { DataService } from '../../../services/data.service';
import Swal from 'sweetalert2';
import { AddTemplateComponent } from './components/add-template/add-template.component';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { PreviewTemplateComponent } from './components/preview-template/preview-template.component';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent {
  templates: any = []
  
  constructor(
    private dialogRef: MatDialog,
    private ds: DataService
  ) {
  }

  ngOnInit() {
    this.getTemplates() 
  }

  getTemplates() {
    this.ds.get('templates').subscribe(
      templates => {
        console.log(templates)
        this.templates = templates
      },
      error => {
        console.error(error)
      }
    )

  }
  
  addTemplate() {
    var modal = this.dialogRef.open(AddTemplateComponent, {
      disableClose: true 
    })
    
    modal.afterClosed().subscribe((result) => {
      console.log(result)
      if (!result) {
        return
      }
      
      this.templates.push(result)
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

    this.dialogRef.open(PreviewTemplateComponent, {
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
      console.log(result)
      if (!result) {
        return
      }
      
      this.templates = this.templates.map((template: any) =>
        template.id === result.id ? result : template
      );
    });
  }

  deleteTemplate(id: number) {
    this.ds.delete('templates/', id).subscribe(
      result => {
        console.log(result)
        this.templates = this.templates.filter((template: any) => template.id !== id);
        Swal.fire({
          title: 'Success!',
          text: 'Template has been deleted.',
          icon: 'success',
          confirmButtonText: 'Close',
          confirmButtonColor: '#777777',
        });
      },
      error => {
        console.error(error)
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#777777',
        });
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

import { Component, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

import { DataService } from '../../../services/data.service';
import { announcement } from '../../../model/announcement.model';
import Swal from 'sweetalert2';
import { AddTemplateComponent } from './components/add-template/add-template.component';

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
}

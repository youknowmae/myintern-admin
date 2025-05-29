import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../services/data.service';
import { PdfPreviewComponent } from '../../../components/pdf-preview/pdf-preview.component';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent {
  displayedColumns: string[] = ['name', 'actions'];

  dataSource: any = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialog,
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService,
    private gs: GeneralService
  ) {
    this.paginator = new MatPaginator(
      this.paginatorIntl,
      this.changeDetectorRef
    );
  }

  ngOnInit() {
    this.getTemplates();
  }

  getTemplates() {
    this.ds.get('adviser/templates').subscribe((templates) => {
      this.dataSource.data = templates;
      this.dataSource.paginator = this.paginator;
    });
  }

  previewTemplate(template: any) {
    if (!template.pdf) {
      this.gs.makeAlert('Error!', 'This file has no pdf preview file.');
      return;
    }

    this.dialogRef.open(PdfPreviewComponent, {
      data: { name: template.name, pdf: template.pdf },
      disableClose: true,
    });
  }
}

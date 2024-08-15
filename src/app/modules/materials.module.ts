import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field'
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

const var_modules = [
    MatFormFieldModule,
    MatLabel,
    MatHint,
    FormsModule,
    MatInputModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatTableModule
]

@NgModule({
    imports: var_modules,
    exports: var_modules
})

export class MaterialsModules {}
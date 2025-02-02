import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field'
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule, MatRippleModule } from "@angular/material/core";
import { MatIconModule } from '@angular/material/icon'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSortModule } from "@angular/material/sort";

const var_modules = [
    MatFormFieldModule,
    MatLabel,
    MatHint,
    FormsModule,
    MatInputModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSidenavModule,    
    MatStepperModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatRippleModule,
    MatSortModule
]

@NgModule({
    imports: var_modules,
    exports: var_modules
})

export class MaterialsModules {}
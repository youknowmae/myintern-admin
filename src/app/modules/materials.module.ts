import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


const var_modules = [
    MatFormFieldModule,
    MatLabel,
    MatHint,
    FormsModule,
    MatInputModule
]

@NgModule({
    imports: var_modules,
    exports: var_modules
})

export class MaterialsModules {}
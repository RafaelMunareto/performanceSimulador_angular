import { DirectiveModule } from './../../../directive/directive.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimuladorPerformanceComponent } from './simulador-performance.component';
import {DialogModule} from 'primeng/dialog';
import { NotasComponent } from './notas/notas.component';
import { ItemsComponent } from './items/items.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {InputSwitchModule} from 'primeng/inputswitch';
import { KnobModule } from 'primeng/knob';
import {InputNumberModule} from 'primeng/inputnumber';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    SimuladorPerformanceComponent,
    NotasComponent,
    ItemsComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    ProgressBarModule,
    InputSwitchModule,
    FormsModule,
    KnobModule,
    InputNumberModule,
    ButtonModule,
    DirectiveModule
  ],
  exports:[
    SimuladorPerformanceComponent
  ]
})
export class SimuladorPerformanceModule { }

import { SharedModule } from 'src/app/shared/shared.module';
import { DirectiveModule } from './../../../directive/directive.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { SimuladorPerformanceService } from '../shared/simulador-performance.service';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';

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
    DirectiveModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    SimuladorPerformanceComponent
  ],
  providers: [
    SimuladorPerformanceService
  ]
})
export class SimuladorPerformanceModule { }

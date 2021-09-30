import { FuncoesGeraisService } from 'src/app/shared/functions/funcoes-gerais.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-simulador-performance',
  templateUrl: './simulador-performance.component.html',
  styleUrls: ['./simulador-performance.component.sass'],

})
export class SimuladorPerformanceComponent implements OnInit {

  @Input() display = false;
  @Input() newVals: any;
  @Input() cardVals: any;
  @Input() loadNotas: any;
  @Input() tipoPerformance: any;
  @Input() unSelected: any;
  @Input() sprint: any[] = [];
  @Input() prioritarios: any[] = [];
  @Input() direcionadores: any[] = [];
  @Output() hide = new EventEmitter<any>();
  dadoAlteradoSimulacao: any[] = [];

  constructor(public fg: FuncoesGeraisService) { }

  ngOnInit(): void {
  }

  recebeDadoAlterado(event: any){
    this.dadoAlteradoSimulacao = this.dadoAlteradoSimulacao.filter(res => res.id_parametros !== event.id_parametros);
    this.dadoAlteradoSimulacao.push(event);
  }

}

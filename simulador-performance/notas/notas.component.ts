import { FuncoesGeraisService } from 'src/app/shared/functions/funcoes-gerais.service';
import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-simulador-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.sass'],
})
export class NotasComponent implements OnInit {


  constructor(public fb: FuncoesGeraisService) { }

  @Input() newVals: any;
  @Input() cardVals: any;
  @Input() loadNotas: any;
  @Input() sprint: any[] = [];
  @Input() direcionador: any[] = [];
  @Input() prioritario: any[] = [];
  @Input() dadoSimuladoArray: any[] = [];
  @Input() recalcularNF:boolean = false;
  @Output() simulacaoConcluida = new EventEmitter<any>();

  canShowTop = false;
  notasNovo = {notasFinal: 0, sprints: 0, prioritarios: 0, direcionadores: 0};


  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges){
    if (changes.dadoSimuladoArray || changes.newVals || changes.recalcularNF){
      this.calculoSprint();
      this.calculoPrioritario();
      this.calculoDirecionadores();
      this.notaFinal();
      this.simulacaoStore();
    }
    
  }

  private calculoSprint()
  {
    const calc = this.sprint.reduce((memo, res) => {
      const simulado = this.dadoSimuladoArray.find(d => d.id_parametros === res.id_parametros);
      const pct = simulado ? simulado.percent_value : res.pct_atingido;
      return memo + parseFloat(res.nu_peso) *
    this.travasPercent(pct, res.pct_max, res.pct_min, res.pct_regua_min) / 100; }, 0);
    this.notasNovo.sprints = this.fb.convertToFloat2(calc);

  }

  private calculoPrioritario()
  {

    const pesoInicial = this.prioritario.reduce((memo, res) => memo + parseFloat(res.nu_peso), 0);
    const calc = this.prioritario.reduce((memo, res) => {
      const simulado = this.dadoSimuladoArray.find(d => d.id_parametros === res.id_parametros);
      const pct = simulado ? simulado.percent_value : res.pct_atingido;
      return memo + parseFloat(res.nu_peso) *
    this.travasPercent(pct, res.pct_max, res.pct_min, res.pct_regua_min) / 100; }, 0);
    const calculo = (parseFloat(calc) / parseFloat(pesoInicial) ) * 100;
    this.notasNovo.prioritarios = this.fb.convertToFloat2(calculo);
  }

  private calculoDirecionadores()
  {
    const pesoInicial = this.direcionador.reduce((memo, res) => memo + parseFloat(res.nu_peso), 0);
    const calc = this.direcionador.reduce((memo, res) => {
      const simulado = this.dadoSimuladoArray.find(d => d.id_parametros === res.id_parametros);
      const pct = simulado ? simulado.percent_value : res.pct_atingido;
      return memo + parseFloat(res.nu_peso) *
    this.travasPercent(pct, res.pct_max, res.pct_min, res.pct_regua_min) / 100; }, 0);
    const calculo = (parseFloat(calc) / parseFloat(pesoInicial) ) * 100;
    this.notasNovo.direcionadores = this.fb.convertToFloat2(calculo);
  }

  private notaFinal()
  {
    const novoArray = [...this.direcionador, ...this.prioritario ];
    const pesoInicial = novoArray.reduce((memo, res) => memo + parseFloat(res.nu_peso), 0);
    const calc = novoArray.reduce((memo, res) => {
      const simulado = this.dadoSimuladoArray.find(d => d.id_parametros === res.id_parametros);
      const pct = simulado ? simulado.percent_value : res.pct_atingido;
      return memo + parseFloat(res.nu_peso) *
    this.travasPercent(pct, res.pct_max, res.pct_min, res.pct_regua_min) / 100; }, 0);
    const calcTotal = (parseFloat(calc) / parseFloat(pesoInicial) ) * 100;
    const sprint =  this.notasNovo.sprints ? this.notasNovo.sprints : this.cardVals.sprints;
    this.notasNovo.notasFinal = this.fb.convertToFloat2(calcTotal + sprint);
  }


  private travasPercent(pct_simulado: any, max: any, min: any, pct_regua_min: any){
    let pct_simuladoFormat = parseFloat(pct_simulado);
    const minFormat = parseFloat(min);
    const maxFormat = parseFloat(max);
    const reguaMin = parseFloat(pct_regua_min);

    if (pct_simuladoFormat > maxFormat){
      pct_simuladoFormat = maxFormat;
    }


    if (pct_simuladoFormat < minFormat){
      pct_simuladoFormat = minFormat;
    }

    if (pct_simuladoFormat > 0){
      pct_simuladoFormat < reguaMin ? 0 : pct_simuladoFormat;
    }
    return pct_simuladoFormat;
  }

  private simulacaoStore(){
    const novoArray = [...this.direcionador, ...this.prioritario, ...this.sprint ];

    novoArray.map((res) => {
      const simulado = this.dadoSimuladoArray.find(d => d.id_parametros === res.id_parametros);
      const pct = simulado ? simulado.percent_value : res.pct_atingido;
    });

    this.simulacaoConcluida.emit(novoArray);

  }

  parseColor(val: any, isCard: boolean = true) {
    const cmpVal = parseFloat(val);
    if (cmpVal >= 100) {
      return isCard ? 'blue_notas' : '#0861acff';
    } else if (cmpVal >= 95 && cmpVal < 100) {
      return isCard ? 'green_notas' : '#61a03cff';
    } else if (cmpVal >= 90 && cmpVal < 95) {
      return isCard ? 'yellow_notas' : '#e29a0aff';
    } else {
      return isCard ? 'red_notas' : '#ca5353';
    }
  }

  parseColorSprint(val: any) {
    const cmpVal = parseFloat(val);
    if (cmpVal > 0) {
      return 'blue_notas';
    } else {
      return 'red_notas';
    }
  }

  salvarNotas(event: any){
    console.log(this.notasNovo);
  }


}

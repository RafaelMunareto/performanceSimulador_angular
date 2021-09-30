import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FuncoesGeraisService } from 'src/app/shared/functions/funcoes-gerais.service';

@Component({
  selector: 'app-simulador-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.sass']
})
export class ItemsComponent implements OnInit {

  @Input() data: any;
  @Output() dadoItemAlterado = new EventEmitter<any>();

  checked = false;
  resultadoSimuladoItem: any;
  oportunidadeItem: any;
  percentualSimuladoItem: any;
  percentValue: any;
  resultadoFinal: any[] = [];
  simuladorInput: any = 0;
  dados_digitados!: number ;

  // variaveis de cálculo
  constructor(public fb: FuncoesGeraisService) { }

  ngOnInit(): void {
    this.initial();
  }

  onSimula(dados: any, event: any){
    this.calculo(dados, event.value);
  }

  onToggle(event: any){
    this.checked = event.checked;
  }

  private calculoBlocos(dados: any){
    this.dadoItemAlterado.emit(dados);
  }

  private calculo(dados: any, resultado: any){
    const variaveis = this.tratamentoVariaveis(dados, resultado);
    const resultadoAnterior = (parseFloat(variaveis.pct_anterior) * parseFloat(variaveis.peso)) / 100;
    const resultadoAtual = (parseFloat(variaveis.pct_simulado) * parseFloat(variaveis.peso)) / 100;
    this.resultadoSimuladoItem = (resultadoAtual - resultadoAnterior);
    this.percentValue = parseFloat(variaveis.pct_simulado);
    if (this.percentValue <= 0 || this.percentValue === null){
      this.resultadoSimuladoItem = null;
    }
    if (this.simuladorInput === null){
      this.percentValue = 0;
      this.resultadoSimuladoItem = null;
    }
    const calculoBloco = {
      id_parametros: variaveis.id_parametros,
      id_categoria: variaveis.id_categoria,
      id_resultado_item: this.resultadoSimuladoItem,
      percent_value: this.percentValue
    };
    this.calculoBlocos(calculoBloco);
  }

  private tratamentoVariaveis(dados: any, simulado: any): any{

    let pct_simulado = parseFloat(simulado);
    const realizadoAnteriorFloat = parseFloat(dados.vr_realizado);
    const objetivoAnteriorFloat = parseFloat(dados.vr_objetivo);
    const esperadoObjetivoFloat = parseFloat(dados.pct_esperado);
    let pct_anterior = parseFloat(dados.pct_atingido);
    let pct_regua_min = parseFloat(dados.pct_regua_min);
    let pct_max = parseInt(dados.pct_max);
    let pct_min = parseInt(dados.pct_min);
    const id_categoria = dados.id_categoria;
    const id_parametros = dados.id_parametros;


    if (this.checked == false){
      const pcts = this.travasPercent(pct_anterior, pct_simulado, pct_max, pct_min, pct_regua_min);
      pct_simulado = pcts.pct_simulado;
      pct_anterior = pcts.pct_anterior;
    }else{

      let pct_simuladoCalculado = ((realizadoAnteriorFloat + pct_simulado) / (objetivoAnteriorFloat * esperadoObjetivoFloat)) * 100;
      if (pct_simuladoCalculado > pct_max){
        pct_simuladoCalculado = pct_max;
      }
      if (pct_simuladoCalculado < pct_min){
        pct_simuladoCalculado = pct_min;
      }
      if (pct_simuladoCalculado < pct_regua_min){
        pct_simuladoCalculado = 0;
      }
      pct_simulado = pct_simuladoCalculado;
    }


    return {objetivo : dados.vr_objetivo,
      peso: dados.nu_peso,
      pct_anterior,
      pct_simulado,
      id_categoria,
      id_parametros
    };
  }

  private travasPercent(pct_anterior: any, pct_simulado: any, max: any, min: any, pct_regua_min: any){
    let pct_anteriorFormat = parseFloat(pct_anterior);
    let pct_simuladoFormat = parseFloat(pct_simulado);
    const minFormat = parseFloat(min);
    const maxFormat = parseFloat(max);
    const reguaMin = parseFloat(pct_regua_min);

    if (pct_simuladoFormat > maxFormat){
      pct_simuladoFormat = maxFormat;
    }

    if (pct_anteriorFormat > maxFormat){
      pct_anteriorFormat = maxFormat;
    }

    if (pct_simuladoFormat < minFormat){
      pct_simuladoFormat = minFormat;
    }

    if (pct_anteriorFormat < minFormat){
      pct_anteriorFormat = minFormat;
    }

    if (pct_simuladoFormat > 0){
      pct_simuladoFormat < reguaMin ? 0 : pct_simuladoFormat;
      pct_anteriorFormat < reguaMin ? 0 : pct_simuladoFormat;
    }
    return {pct_anterior: pct_anteriorFormat, pct_simulado: pct_simuladoFormat};
  }

  private initial() {
    const variaveis = this.tratamentoVariaveis(this.data, this.data.vr_realizado);
    const pesoMax = (parseFloat(variaveis.peso) * parseFloat(this.data.pct_max)) / 100;
    this.oportunidadeItem = pesoMax - ((variaveis.pct_anterior * variaveis.peso) / 100);
    this.simuladorInput = parseFloat(variaveis.pct_anterior);
    this.percentValue = parseFloat(variaveis.pct_anterior);
  }


}

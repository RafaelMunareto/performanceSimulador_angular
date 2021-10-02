import { SimuladorPerformanceService } from './../shared/simulador-performance.service';
import { FuncoesGeraisService } from 'src/app/shared/functions/funcoes-gerais.service';
import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-simulador-performance',
  templateUrl: './simulador-performance.component.html',
  styleUrls: ['./simulador-performance.component.sass'],

})
export class SimuladorPerformanceComponent implements OnInit, OnChanges {

  @Input() display = false;
  @Input() newVals: any;
  @Input() cardVals: any;
  @Input() loadNotas: any;
  @Input() tipoPerformance: any;
  @Input() unSelected: any;
  @Input() sprint: any[] = [];
  @Input() prioritarios: any[] = [];
  @Input() direcionadores: any[] = [];
  @Input() simulacoes: any[] = [];
  @Output() hide = new EventEmitter<any>();
  @Output() updateDropdown = new EventEmitter<any>();
  @Output() simulacaoAtual  = new EventEmitter<any>();
  @Output() salvarNotasFinais  = new EventEmitter<any>();
  dadoAlteradoSimulacao: any[] = [];
  dadosEnvioSimulacao: any[] = [];
  resourceForm: any = FormGroup;
  storeBoolean = false;
  data =  new Date();
  descricao: any;
  simulado: any;
  responsavel = '';
  responsavel_matricula = '';
  progressBar = false;
  recalcularNotaFinal:any;

  constructor(public fg: FuncoesGeraisService,
              private service: SimuladorPerformanceService,
              private formBuilder: FormBuilder) {}


  ngOnInit(): void {
    this.action();
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes.display){
      this.dadoAlteradoSimulacao = [];
    }

  }

  store()
  {

    this.dadosEnvioSimulacao.map(res => {
      res.no_simulacao = this.resourceForm.get('no_simulacao').value;
      res.descricao = this.resourceForm.get('descricao').value;
    });
    this.dadosEnvioSimulacao.map((res) => {
      this.dadoAlteradoSimulacao.map(d => {
        if (d.id_parametros == res.id_parametros){
            res.pct_atingido = d.percent_value;
        }
      });
    });
    this.service.store(this.dadosEnvioSimulacao)
        .subscribe( () => {
            this.fg.actionsForSuccess('Sucesso', 'Avaliação salva com sucesso!');
            this.storeBoolean = false;
            this.resourceForm.reset();
            this.updateDropdown.emit(true);
        }, error => {
            this.fg.actionsForError('Erro', error);
        });
  }

  salvar()
  {
    this.storeBoolean = true;
  }

  recebeDadoAlterado(event: any){
    this.dadoAlteradoSimulacao = this.dadoAlteradoSimulacao.filter(res => res.id_parametros !== event.id_parametros);
    this.dadoAlteradoSimulacao.push(event);
  }

  recebeSimulacao(event: any){
    this.dadosEnvioSimulacao = event;
  }


  changeSimulacao(event: any)
  {
    this.progressBar = true;
    if (event.value === '0'){
      this.simulacaoAtual.emit(true);
      this.responsavel = '';
      this.progressBar = false;
    }else{
      this.service.getAll(event.value).pipe(take(1)).subscribe(res => {
        this.prioritarios = res.filter((r: any) => r.id_categoria == 1);
        this.direcionadores = res.filter((r: any) => r.id_categoria == 2);
        this.sprint = res.filter((r: any) => r.id_categoria == 3);
        this.data = res[0].dt_simulacao;
        this.descricao = res[0].descricao;
        this.responsavel_matricula = res[0].nu_matricula_responsavel;
        this.responsavel = res[0].no_responsavel;
        this.progressBar = false;
        this.recalcularNotaFinal = true;
      });
    }
  }

  action()
  {
    this.resourceForm = this.formBuilder.group({
      no_simulacao: [null, [Validators.required, Validators.minLength(3)]],
      descricao: [null, [Validators.required, Validators.minLength(3)]],
    });

  }

}

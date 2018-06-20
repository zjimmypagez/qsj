import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from "rxjs/observable";
import { Subscription } from 'rxjs/Subscription';

import { Garrafa, GarrafaSIdCSRotulo } from '../../../../interfaces/garrafa';
import { TipoVinho } from '../../../../interfaces/tipoVinho';

import { OrdenarTablesService } from '../../../../services/funcoes-service/ordenar-tables.service';

import { ValidatorModelo } from '../../../../validators/validator-garrafas';

import { VinhoServiceService } from '../../../../services/vinho/vinho-service.service';
import { GarrafaServiceService } from '../../../../services/garrafa/garrafa-service.service';

@Component({
	selector: 'app-inserir-garrafa-admin',
	templateUrl: './inserir-garrafa-admin.component.html',
	styleUrls: ['./inserir-garrafa-admin.component.css']
})
export class InserirGarrafaAdminComponent implements OnInit, OnDestroy {
	GarrafaForm: FormGroup;
	// DropDowns
	capacidades: number[] = [0.187, 0.375, 0.500, 0.750, 1.000, 1.500, 3.000, 6.000, 12.000];
	// Lista de modelos de caixa a ler da BD
	garrafas: Garrafa[] = [];
	// Lista de vinhos a ler da BD
	vinhos: TipoVinho[] = [];

	private subs: Subscription;

	constructor( private router: Router, private fb: FormBuilder, private ordenarTableService: OrdenarTablesService, private vinhoService: VinhoServiceService, private garrafaService: GarrafaServiceService ) { }

	ngOnInit() {
		this.getVinhos();
		this.getGarrafas();
		this.iniGarrafaForm();
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}

	// Subcrição do service VinhoService e obtenção dos dados de todos os vinhos provenientes da BD
	getVinhos(){
		this.subs = this.vinhoService.getVinhos().subscribe(
			(data: TipoVinho[]) => { this.vinhos = data },
			err => console.error(err),
			() => {
				this.vinhos = this.ordenarTableService.ordenarTabelaMV(this.vinhos);
			}
		);
	}

	// Subcrição do service GarrafaService e obtenção dos dados de todas as garrafas provenientes da BD
	getGarrafas(){
		this.subs = this.garrafaService.getGarrafas().subscribe(
			(data: Garrafa[]) => { this.garrafas = data },
			err => console.error(err),
			() => {
				this.iniGarrafaForm();
			}
		);
	}

	// Inserir nova garrafa
	createGarrafa(newGarrafa: GarrafaSIdCSRotulo){
		this.subs = this.garrafaService.createGarrafa(newGarrafa).subscribe(
			data => data,
			err => console.error(err),
			() => {
				this.router.navigate(['/admin/garrafas']);
			}
		);
	}

	// Inicializar objeto form GarrafaForm
	iniGarrafaForm(){
		this.GarrafaForm = this.fb.group({
			'cuba': ['', Validators.compose([Validators.required, Validators.min(1)])],
			'ano': ['', Validators.compose([Validators.required, Validators.min(1900), Validators.max(2100)])],
			'tipoVinho': ['', Validators.required],
			'capacidade': ['', Validators.required]
		}, { validator: ValidatorModelo(this.garrafas) }
		);
	}

	// Criação do novo modelo de garrafa após verificações 
	novaGarrafa(form){
		var newGarrafa: GarrafaSIdCSRotulo = {
			TipoDeVinho_ID: form.tipoVinho,
			Pipa: form.cuba,
			Ano: form.ano,
			Capacidade: form.capacidade
		}
		this.createGarrafa(newGarrafa);
		alert("O modelo de garrafa foi criado com sucesso!");
	}

	// Limpa os dados do Formulário
	clearDados(){
		this.clearForm();
	}

	// Função que limpa os dados do form GarrafaForm
	clearForm(){
		this.GarrafaForm.controls['cuba'].reset('');
		this.GarrafaForm.controls['ano'].reset('');
		this.GarrafaForm.controls['tipoVinho'].reset('');
		this.GarrafaForm.controls['capacidade'].reset('');
		this.GarrafaForm.markAsUntouched();
	}

}
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastrar-cliente',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './cadastrar-cliente.html',
  styleUrl: './cadastrar-cliente.css',
})
export class CadastrarCliente {

  //Atributos
  mensagemSucesso = signal<string>('');
  mensagemErro = signal<string>('');

  //instanciando a bilbioteca HttpClient
  http = inject(HttpClient);

  //criando um formulário para capturar os campos
  formulario = new FormGroup({
      nome : new FormControl('', [Validators.required, Validators.minLength(6)]),
      cpf : new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      logradouro : new FormControl('', [Validators.required]),
      numero : new FormControl('', [Validators.required]),
      complemento : new FormControl('', [Validators.required]),
      bairro : new FormControl('', [Validators.required]),
      cidade : new FormControl('', [Validators.required]),
      uf : new FormControl('', [Validators.required]),
      cep : new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
  });

  buscarCep(){

    //capturar o valor preenchido no campo cep do formulário
    const cep = this.formulario.get('cep')?.value;

    //verificar se o campo tem no minimo 8 caracteres preenchidos
    if(cep?.length != 8) return; // finalizo a função

    //consultar o cep no API ViaCep
    this.http.get('https://viacep.com.br/ws/' + cep + "/json/")
    .subscribe((data: any) => {
        //verificar se retornou erro
        if(data.erro) return; // finalizo a função

        //preencher o formulário com os dados obtidos do endereço
        this.formulario.patchValue({
          logradouro: data.logradouro,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
        });
       });
  }

  //função chamada quando o formulário for submetido
  cadastrar() {

    //limpar as mensagens
    this.mensagemSucesso.set('');
    this.mensagemErro.set('');
    
    //capturando os dados do formulário
    const request = { //JSON
      nome:  this.formulario.value.nome!,
      cpf: this.formulario.value.cpf!,
      enderecos: [
        {
          logradouro: this.formulario.value.logradouro!,
          numero: this.formulario.value.numero!,
          complemento: this.formulario.value.complemento!,
          bairro: this.formulario.value.bairro!,
          cidade: this.formulario.value.cidade!,
          uf: this.formulario.value.uf!,
          cep: this.formulario.value.cep!
        }
      ]
    }

    //enviando os dados para o backend
    this.http.post('http://localhost:8081/api/cliente/criar', request, { responseType: 'text' })
      .subscribe({
        next : (resposta) => { //capurando a resposta de sucesso do backend
          this.mensagemSucesso.set(resposta); //exibindo a mensagem de sucesso
          this.formulario.reset(); //limpando o formulário após o cadastro
        },
        error: (e) => { //capturando a resposta de erro do backend
          this.mensagemErro.set(e.error);
        }
      });
  }
}

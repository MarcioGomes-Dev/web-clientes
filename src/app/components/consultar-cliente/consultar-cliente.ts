import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { subscribeOn } from 'rxjs';

@Component({
  selector: 'app-consultar-cliente',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './consultar-cliente.html',
  styleUrl: './consultar-cliente.css',
})
export class ConsultarCliente {

  //Atributos
  clientes = signal<any[]>([]); //array de objetos (lista)

  //instanciando a bilbioteca HttpClient
  http = inject(HttpClient);

  //variáveis para exibir as mensagens de sucesso ou de erro
  mensagemSucesso = signal<string>('');
  mensagemErro = signal<string>('');

  //Criando um formulário
  formulario = new FormGroup({
    nome : new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  //Função para consultar os clientes na API
  consultar() {

    //capturar o valor preenchido no campo do formulário
    const nome = this.formulario.value.nome!;

    //fazendo uma requisição HTTP CLIENT para consultar os clientes na API
    this.http.get('http://localhost:8081/api/cliente/consultar?nome=' + nome)
      .subscribe((data) => {
        console.log(data);
        //guardar os dados obtidos da API (listagem de clientes)
        this.clientes.set(data as any[]);
      });
  }

  //função para excluir um cliente na API
  excluir(id : number){
    if(confirm('Deseja realmente excluir o cliente selecionado?')){

      //limpar as mensagens
      this.mensagemSucesso.set('');
      this.mensagemErro.set('');

      // fazendo uma requisição HTTP CLIENT para excluir um cliente através do ID
      this.http.delete('http://localhost:8081/api/cliente/excluir/' + id, { responseType: 'text'})
      .subscribe({
        next: (resposta) => { //capturando resposta de sucesso!
          this.mensagemSucesso.set(resposta);
          this.consultar(); //executando a função de consulta
        },
        error: (e) => { //capturando reposta de erro!
          this.mensagemErro.set(e.error);
        }
      });
    }
  }

}

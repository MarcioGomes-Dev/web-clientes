import { Routes } from '@angular/router';
import { CadastrarCliente } from './components/cadastrar-cliente/cadastrar-cliente';
import { ConsultarCliente } from './components/consultar-cliente/consultar-cliente';

export const routes: Routes = [
    {
        path: 'pages/cadastrar-cliente', //rota
        component: CadastrarCliente //componente
    },
    {
        path: 'pages/consultar-cliente', //rota
        component: ConsultarCliente //componente
    },
    {
        path: '', //rota raiz do projeto
        pathMatch: 'full', //exatamente no raiz do projeto
        redirectTo: '/pages/consultar-cliente' //redirecionamento
    }
];

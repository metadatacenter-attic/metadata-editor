import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  {path: 'step', loadChildren: './step/step.module#StepModule'},
  {path: 'instances/edit/:id', loadChildren: './instance/instance.module#InstanceModule'},
  {path: 'instances/create/:templateId', loadChildren: './instance/instance.module#InstanceModule'},
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '**', redirectTo: '', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

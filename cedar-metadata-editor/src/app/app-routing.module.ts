import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  {path: 'templates/:templateId', loadChildren: './modules/metadata-editor/metadata-editor.module#MetadataEditorModule'},
  {path: 'template-instances/:templateId', loadChildren: './modules/metadata-editor/metadata-editor.module#MetadataEditorModule'},
  {path: 'instances/edit/:id', loadChildren: './modules/metadata-editor/metadata-editor.module#MetadataEditorModule'},
  {path: 'instances/create/:templateId', loadChildren: './modules/metadata-editor/metadata-editor.module#MetadataEditorModule'},
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '**', redirectTo: '', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  {path: 'template-fields/:templateFieldId', loadChildren: './modules/metadata-editor/metadata-editor.module#MetadataEditorModule'},
  {path: 'template-elements/:templateElementId', loadChildren: './modules/metadata-editor/metadata-editor.module#MetadataEditorModule'},
  {path: 'templates/:templateId', loadChildren: './modules/metadata-editor/metadata-editor.module#MetadataEditorModule'},
  {path: 'template-instances/:instanceId', loadChildren: './modules/metadata-editor/metadata-editor.module#MetadataEditorModule'},
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

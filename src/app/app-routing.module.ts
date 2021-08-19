import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QuestionsListComponent } from './components/questions-list/questions-list.component';
import { ViewQuestionComponent } from './components/view-question/view-question.component';
import { WriteAnswerComponent } from './components/write-answer/write-answer.component';
import { WriteQuestionComponent } from './components/write-question/write-question.component';
import { AuthGuardService } from './shared/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: MainContentComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuardService],
      },
      { path: 'question/:id', component: ViewQuestionComponent },
      {
        path: 'question/:id/answer',
        component: WriteAnswerComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'ask',
        component: WriteQuestionComponent,
        canActivate: [AuthGuardService],
      },
      { path: 'questions', component: QuestionsListComponent },
      { path: 'about', component: AboutComponent },
    ],
  },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: 'auth' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

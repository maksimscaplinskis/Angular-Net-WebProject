import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, combineLatest, of, startWith } from 'rxjs';
import { Article } from './models/article.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    RouterOutlet,
    AsyncPipe,
    ReactiveFormsModule,
    NgFor,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private url = "Articles";
  constructor(private http: HttpClient) {}

  articlesForm = new FormGroup({
    title: new FormControl<string>(""),
    description: new FormControl<string>(""),
    date: new FormControl<string>(""),
    type: new FormControl<string>(""),
  });

  search = new FormControl<string>('');
  filterDate = new FormControl<string>('new');
  filterType = new FormControl<string>('');

  articles$ = combineLatest([
    this.getArticles(),
    this.search.valueChanges.pipe(startWith('')),
    this.filterDate.valueChanges.pipe(startWith('new')),
    this.filterType.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([articles, searchTerm, sortTerm, filterType]) => {
      let filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes((searchTerm ?? '').toLowerCase()) ||
        article.description.toLowerCase().includes((searchTerm ?? '').toLowerCase())
      );

      if (filterType) {
        filteredArticles = filteredArticles.filter(article => article.type === filterType);
      }

      if (sortTerm === 'new') {
        filteredArticles = filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } else if (sortTerm === 'oldest') {
        filteredArticles = filteredArticles.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }

      return filteredArticles;
    })
  );

  ngOnInit() {
    this.search.setValue('');
  }

  onFormSubmit() {
    const addArticleRequest = {
      title: this.articlesForm.value.title,
      description: this.articlesForm.value.description,
      date: this.articlesForm.value.date,
      type: this.articlesForm.value.type,
    };

    this.http.post(`${environment.apiUrl}/${this.url}`, addArticleRequest)
      .subscribe({
        next: () => {
          this.articles$ = combineLatest([
            this.getArticles(),
            this.search.valueChanges.pipe(startWith('')),
            this.filterDate.valueChanges.pipe(startWith('new')),
            this.filterType.valueChanges.pipe(startWith(''))
          ]).pipe(
            map(([articles, searchTerm, sortTerm, filterType]) => {
              let filteredArticles = articles.filter(article =>
                article.title.toLowerCase().includes((searchTerm ?? '').toLowerCase()) ||
                article.description.toLowerCase().includes((searchTerm ?? '').toLowerCase())
              );

              if (filterType) {
                filteredArticles = filteredArticles.filter(article => article.type === filterType);
              }

              if (sortTerm === 'new') {
                filteredArticles = filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              } else if (sortTerm === 'oldest') {
                filteredArticles = filteredArticles.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              }

              return filteredArticles;
            })
          );
          this.articlesForm.reset();
        }
      });
  }

  private getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/${this.url}`);
  }
}




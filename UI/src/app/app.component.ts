import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, combineLatest, startWith } from 'rxjs';
import { Article } from './models/article.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

  ngOnInit() {
    this.search.setValue('');
    this.articlesForm.reset();
    this.initializeArticlesStream();
  }

  private getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/${this.url}`);
  }

  articlesForm = new FormGroup({
    title: new FormControl<string>("", Validators.required),
    description: new FormControl<string>("", Validators.required),
    date: new FormControl<string>("", Validators.required),
    type: new FormControl<string>("", Validators.required),
  });

  search = new FormControl<string>('');
  filterDate = new FormControl<string>('new');
  filterType = new FormControl<string>('');

  articles$!: Observable<Article[]>;

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
          this.initializeArticlesStream();
          this.articlesForm.reset();
        }
      });
  }



  private initializeArticlesStream() {
    this.articles$ = combineLatest([
      this.getArticles(),
      this.search.valueChanges.pipe(startWith('')),
      this.filterDate.valueChanges.pipe(startWith('new')),
      this.filterType.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([articles, search, filterDate, filterType]) => this.searchAndFilterArticles(articles, search!, filterDate!, filterType!))
    );
  }

  private searchAndFilterArticles(articles: Article[], search: string , filterDate: string, filterType: string): Article[] {
    let filteredArticles = articles.filter(article =>
      article.title.toLowerCase().includes((search ?? '').toLowerCase()) ||
      article.description.toLowerCase().includes((search ?? '').toLowerCase())
    );

    if (filterType) {
      filteredArticles = filteredArticles.filter(article => article.type === filterType);
    }

    if (filterDate === 'new') {
      filteredArticles = filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (filterDate === 'oldest') {
      filteredArticles = filteredArticles.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return filteredArticles;
  }
}




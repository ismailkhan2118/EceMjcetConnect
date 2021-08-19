import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/shared/post.model';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  posts: Post[];
  isDataReady = false;
  loadMoreBtn = true;
  isLoading = false;
  noData = false;
  constructor(private homeService: HomeService, private router: Router) {}

  ngOnInit(): void {
    this.getPostsArray();
    this.isLoading = true;

    this.homeService.pushAnsweredFirstBatch().subscribe(
      (d) => {
        this.isLoading = false;
        if (d.empty) {
          this.loadMoreBtn = false;
          this.noData = true;
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  loadMore() {
    this.isLoading = true;
    this.homeService.pushAnsweredNextBatch().subscribe(
      (d) => {
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  getPostsArray() {
    this.homeService.isPostsArrayReady.subscribe((isReady) => {
      if (isReady === 'true') {
        this.posts = this.homeService.getPosts();
        this.isDataReady = true;
      } else if (isReady === 'complete') {
        this.posts = this.homeService.getPosts();
        if (this.posts.length > 0) {
          //check for prev emit
          this.isDataReady = true;
          this.loadMoreBtn = false;
        }
      }
    });
  }

  viewQues(docid: string) {
    this.router.navigate(['question', docid]);
  }
}

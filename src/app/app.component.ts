import { MyErrorHandler } from './common/my-error-handler';
import { BadRequestError } from './common/bad-request-error';
import { Post } from './models/post';
import { NotFoundError } from './common/not-found-error';
import { AppError } from './common/app-error';
import { PostService } from './services/post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  posts: any[];
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getAll().subscribe(
      (res) => {
        console.log(res);

        this.posts = res;
      },
      (err: AppError) => {
        if (err instanceof NotFoundError) {
          alert('Posts are not found.');
        } else {
          throw MyErrorHandler;
        }
      }
    );
  }

  addPost(input: HTMLInputElement) {
    const post: Post = {
      id: undefined,
      userId: undefined,
      title: input.value,
      body: 'Gemy',
    };
    input.value = '';

    this.posts.unshift(post);

    this.postService.create(post).subscribe(
      (res: Post) => {
        post.id = res.id;
        post.userId = res.userId;
      },
      (err: AppError) => {
        this.posts.shift();
        if (err instanceof BadRequestError) {
          alert('Bad request error occured.');
        } else {
          throw MyErrorHandler;
        }
      }
    );
  }

  updatePost(post: Post): void {
    const prevPostTitle = post.title;
    post.title = 'Updated Post';
    this.postService.update(post).subscribe(null, (err: AppError) => {
      post.title = prevPostTitle;

      if (err instanceof NotFoundError) {
        alert('Cannot update the post.');
      } else {
        throw MyErrorHandler;
      }
    });
  }

  deletePost(post: Post, index: number): void {
    this.posts.splice(index, 1);

    this.postService.delete(post.id).subscribe(null, (err: AppError) => {
      this.posts.splice(index, 0, post);

      if (err instanceof NotFoundError) {
        alert('Post is not found.');
      } else {
        throw MyErrorHandler;
      }
    });
  }
}

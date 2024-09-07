import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor(private apollo: Apollo) {}

  getQuestions(searchInput?: {
    filter_tag_ids?: number[];
    only_mine?: boolean;
  }): Observable<any> {
    const token = localStorage.getItem('token');

    const QUESTIONS_QUERY = gql`
      query Questions($searchInput: SearchInput) {
        questions(searchInput: $searchInput) {
          id
          title
          description
          creation_date
          user {
            nick_name
          }
          tags {
            id
            tag_name
          }
        }
      }
    `;

    return this.apollo.query({
      query: QUESTIONS_QUERY,
      variables: {
        searchInput: searchInput || undefined,
      },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }

  getTags(): Observable<any> {
    const TAGS_QUERY = gql`
      query Tags {
        tags {
          id
          tag_name
        }
      }
    `;
    return this.apollo.query({
      query: TAGS_QUERY,
    });
  }
}

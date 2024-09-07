import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnswersService {
  constructor(private apollo: Apollo) {}

  createAnswer(createAnswerInput: {
    content: string;
    question_id: number;
  }): Observable<any> {
    const token = localStorage.getItem('token');

    const CREATE_ANSWER_MUTATION = gql`
      mutation CreateAnswer($createAnswerInput: CreateAnswerInput!) {
        createAnswer(createAnswerInput: $createAnswerInput) {
          id
          content
        }
      }
    `;

    return this.apollo.mutate({
      mutation: CREATE_ANSWER_MUTATION,
      variables: {
        createAnswerInput: createAnswerInput,
      },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }

  removeAnswer(answerId: number) {
    const token = localStorage.getItem('token');

    return this.apollo.mutate({
      mutation: gql`
        mutation RemoveAnswer($removeAnswerId: Int!) {
          removeAnswer(id: $removeAnswerId) {
            id
          }
        }
      `,
      variables: {
        removeAnswerId: answerId,
      },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }
}

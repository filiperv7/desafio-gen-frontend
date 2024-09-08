import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Tag } from '../components/question-form/question-form.component';

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
            id
            nick_name
          }
          answers {
            content
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
    const token = localStorage.getItem('token');

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
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }

  getTagsDropDown(): Observable<Tag[]> {
    const token = localStorage.getItem('token');

    const TAGS_QUERY = gql`
      query Tags {
        tags {
          id
          tag_name
        }
      }
    `;
    return this.apollo
      .query<{ tags: Tag[] }>({
        query: TAGS_QUERY,
        context: {
          headers: {
            Authorization: token,
          },
        },
      })
      .pipe(map((result) => result.data.tags || []));
  }

  getQuestionById(questionId: number): Observable<any> {
    const token = localStorage.getItem('token');

    const QUESTION_QUERY = gql`
      query Question($questionId: Int!) {
        question(id: $questionId) {
          id
          title
          description
          creation_date
          user {
            nick_name
          }
          tags {
            tag_name
          }
          answers {
            id
            content
            creation_date
            user {
              id
              nick_name
            }
          }
        }
      }
    `;

    return this.apollo.query({
      query: QUESTION_QUERY,
      variables: {
        questionId: questionId,
      },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }

  createQuestion(input: any) {
    const token = localStorage.getItem('token');

    return this.apollo.mutate({
      mutation: gql`
        mutation CreateQuestion($createQuestionInput: CreateQuestionInput!) {
          createQuestion(createQuestionInput: $createQuestionInput) {
            id
            title
            description
            tags {
              id
              tag_name
            }
          }
        }
      `,
      variables: { createQuestionInput: input },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }

  updateQuestion(input: any) {
    const token = localStorage.getItem('token');

    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateQuestion($updateQuestionInput: UpdateQuestionInput!) {
          updateQuestion(updateQuestionInput: $updateQuestionInput) {
            title
          }
        }
      `,
      variables: { updateQuestionInput: input },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }

  removeQuestion(questionId: number): Observable<any> {
    const token = localStorage.getItem('token');

    return this.apollo.mutate({
      mutation: gql`
        mutation RemoveQuestion($removeQuestionId: Int!) {
          removeQuestion(id: $removeQuestionId) {
            id
            title
          }
        }
      `,
      variables: { removeQuestionId: questionId },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });
  }
}

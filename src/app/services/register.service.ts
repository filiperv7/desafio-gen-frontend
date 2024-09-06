import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private apollo: Apollo) {}

  register(
    nickName: string,
    email: string,
    name: string,
    position: string,
    password: string
  ): Observable<any> {
    const mutation = gql`
      mutation CreateUserAuth($createUserAuthInput: CreateUserAuthInput!) {
        createUserAuth(createUserAuthInput: $createUserAuthInput) {
          id
          name
          nick_name
          email
          position
        }
      }
    `;

    return this.apollo.mutate({
      mutation,
      variables: {
        createUserAuthInput: {
          nick_name: nickName,
          email,
          name,
          position,
          password,
        },
      },
    });
  }
}

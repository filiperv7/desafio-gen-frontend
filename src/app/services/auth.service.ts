import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginMutation = gql`
    query Login($login: LoginInput!) {
      login(login: $login) {
        access_token
        expires_in
        token_type
      }
    }
  `;

  constructor(private apollo: Apollo) {}

  login(nickName: string, password: string): Observable<any> {
    return this.apollo.watchQuery({
      query: this.loginMutation,
      variables: {
        login: {
          nick_name: nickName,
          password: password,
        },
      },
    }).valueChanges;
  }
}

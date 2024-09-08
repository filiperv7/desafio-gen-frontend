import { ApplicationConfig, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApolloClientOptions, from, InMemoryCache } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

const uri = 'http://localhost:6001/graphql';
export function apolloOptionsFactory(router: Router): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink);

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ extensions }) => {
        const code = (extensions as { [key: string]: any })['code'];
        if (code === 'UNAUTHENTICATED') {
          router.navigate(['/']);
        }
      });
    }
  });

  return {
    link: from([errorLink, httpLink.create({ uri })]),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: (router: Router) => apolloOptionsFactory(router),
    deps: [Router],
  },
];

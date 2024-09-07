import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class DecodeTokenService {
  constructor() {}

  decodeToken(): any {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwt_decode<DecodedToken>(token);

      return decodedToken['id'];
    }

    return null;
  }
}

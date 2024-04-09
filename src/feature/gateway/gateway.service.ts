import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AuthService {
//   constructor(private readonly authClient: AuthServiceClient) {}

//   async login(username: string, password: string): Promise<string> {
//     const request = new LoginRequest();
//     request.setUsername(username);
//     request.setPassword(password);

//     const response: LoginResponse = await new Promise((resolve, reject) => {
//       this.authClient.login(request, (err, response) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(response);
//         }
//       });
//     });

//     return response.getToken();
//   }
// }
//

export class AuthService {
  private _token: string | undefined;

  constructor(private readonly url: string) {}

  get token() {
    return this._token;
  }

  async login(email: string, password: string): Promise<boolean> {
    const res = await fetch(`${this.url}/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data: { accessToken: string } = await res.json();
      this._token = data.accessToken;
      return true;
    }
    return false;
  }

  async register(email: string, name: string, password: string): Promise<boolean> {
    const res = await fetch(`${this.url}/register`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    return res.ok;
  }
}
